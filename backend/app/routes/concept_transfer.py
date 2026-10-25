
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from bson import ObjectId
from json import JSONDecodeError
import json

from app.dependencies import get_current_user
from app.database import interviews_collection, answers_collection
from app.services.gemini_service import client, MODEL_NAME


router = APIRouter(tags=["Concept Transfer"])


class ConceptPracticeRequest(BaseModel):
    interview_id: str
    question_number: int = Field(ge=1)


def ask_gemini(prompt: str) -> dict:
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )

        if not response.text:
            raise HTTPException(
                status_code=502,
                detail="Gemini returned an empty response."
            )

        try:
            result = json.loads(response.text)
        except JSONDecodeError:
            raise HTTPException(
                status_code=502,
                detail="Gemini returned invalid JSON."
            )

        if not isinstance(result, dict):
            raise HTTPException(
                status_code=502,
                detail="Gemini returned an unexpected response format."
            )

        return result

    except HTTPException:
        raise
    except Exception as exc:
        print(f"Concept Transfer Gemini error: {exc}")
        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to generate concept practice. "
                "Check the Gemini API configuration."
            )
        )


def get_owned_interview(interview_id: str, user_id: str):
    try:
        object_id = ObjectId(interview_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid interview ID."
        )

    interview = interviews_collection.find_one({
        "_id": object_id,
        "user_id": user_id
    })

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found."
        )

    return interview


@router.get("/answered/{interview_id}")
async def get_answered_questions(
    interview_id: str,
    current_user: dict = Depends(get_current_user)
):
    interview = get_owned_interview(
        interview_id,
        current_user["id"]
    )

    saved_answers = list(
        answers_collection.find(
            {
                "interview_id": interview_id,
                "user_id": current_user["id"]
            },
            {
                "_id": 0,
                "question_number": 1,
                "question": 1,
                "score": 1
            }
        ).sort("question_number", 1)
    )

    interview_questions = interview.get("questions", [])
    questions_by_number = {}

    for answer in saved_answers:
        number = answer.get("question_number")

        if (
            isinstance(number, int)
            and 1 <= number <= len(interview_questions)
        ):
            questions_by_number[number] = {
                "question_number": number,
                "question": answer.get(
                    "question",
                    interview_questions[number - 1]
                ),
                "score": answer.get("score")
            }

    answered_questions = [
        questions_by_number[number]
        for number in sorted(questions_by_number)
    ]

    return {
        "interview_id": interview_id,
        "total_questions": len(interview_questions),
        "answered_count": len(answered_questions),
        "answered_questions": answered_questions
    }


@router.post("/start")
async def start_concept_practice(
    data: ConceptPracticeRequest,
    current_user: dict = Depends(get_current_user)
):
    interview = get_owned_interview(
        data.interview_id,
        current_user["id"]
    )

    questions = interview.get("questions", [])

    if data.question_number > len(questions):
        raise HTTPException(
            status_code=400,
            detail=f"This interview contains {len(questions)} questions."
        )

    original_question = questions[data.question_number - 1]

    original_answer = answers_collection.find_one({
        "interview_id": data.interview_id,
        "user_id": current_user["id"],
        "question_number": data.question_number
    })

    if not original_answer:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Question {data.question_number} has not been answered. "
                "Choose a question you have already answered."
            )
        )

    try:
        original_score = float(original_answer.get("score"))
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=500,
            detail="The saved answer has an invalid score."
        )

    # A perfect score needs no improvement analysis or practice questions.
    if original_score == 10:
        return {
            "message": "Nothing to improve! You scored 10/10 on this question.",
            "interview_id": data.interview_id,
            "question_number": data.question_number,
            "original_question": original_question,
            "original_score": original_score,
            "understanding_status": "perfect",
            "weak_concept": None,
            "concept_explanation": None,
            "reason": None,
            "practice_questions": []
        }

    prompt = f"""
You are an expert technical interviewer and a patient programming tutor.

Your task is to identify what this candidate actually needs to improve.
Be specific, accurate, constructive, and beginner-friendly.

Interview role: {interview.get("role", "Not specified")}
Technology: {interview.get("technology", "Not specified")}
Experience level: {interview.get("experience", "Not specified")}

Original question:
{original_question}

Candidate's actual answer:
{original_answer.get("answer", "")}

Score: {original_score}/10

Existing interviewer feedback:
{original_answer.get("feedback", "No feedback available.")}

Requirements:
1. Identify a specific concept related to the question and answer.
2. Explain the concept in simple language, using a technical example.
3. Explain what is missing, incorrect, or could be improved in the candidate's
   actual answer. Do not invent mistakes that are not supported by the evidence.
4. Generate exactly two NEW practice questions about the identified concept.
5. Do not answer the practice questions.
6. Every field must contain meaningful, non-empty text.
7. If the answer is mostly correct, explain the specific opportunity for
   improvement rather than inventing a major weakness.
8. Return valid JSON only, with no Markdown fences or text outside the JSON.

Use exactly this JSON structure:
{{
  "weak_concept": "Specific concept name",
  "concept_explanation": "A clear explanation with a useful example",
  "reason": "Specific explanation of what the candidate can improve",
  "practice_questions": [
    "First new practice question",
    "Second new practice question"
  ]
}}
"""

    result = ask_gemini(prompt)

    weak_concept = result.get("weak_concept")
    explanation = result.get("concept_explanation") or result.get("explanation")
    reason = result.get("reason")
    practice_questions = result.get("practice_questions")

    valid_questions = (
        isinstance(practice_questions, list)
        and len(practice_questions) >= 2
        and all(
            isinstance(question, str) and question.strip()
            for question in practice_questions[:2]
        )
    )

    valid_result = (
        isinstance(weak_concept, str)
        and bool(weak_concept.strip())
        and isinstance(explanation, str)
        and bool(explanation.strip())
        and isinstance(reason, str)
        and bool(reason.strip())
        and valid_questions
    )

    # Retry once if Gemini returns incomplete data.
    if not valid_result:
        result = ask_gemini(
            prompt
            + """

IMPORTANT: Your previous response was incomplete or had empty fields.
Regenerate the entire response. Every field must be populated with useful,
specific content. Return exactly two non-empty practice questions.
Return valid JSON only.
"""
        )

        weak_concept = result.get("weak_concept")
        explanation = result.get("concept_explanation") or result.get("explanation")
        reason = result.get("reason")
        practice_questions = result.get("practice_questions")

        valid_questions = (
            isinstance(practice_questions, list)
            and len(practice_questions) >= 2
            and all(
                isinstance(question, str) and question.strip()
                for question in practice_questions[:2]
            )
        )

        valid_result = (
            isinstance(weak_concept, str)
            and bool(weak_concept.strip())
            and isinstance(explanation, str)
            and bool(explanation.strip())
            and isinstance(reason, str)
            and bool(reason.strip())
            and valid_questions
        )

    if not valid_result:
        raise HTTPException(
            status_code=502,
            detail=(
                "The AI returned incomplete concept analysis after retrying. "
                "Please try again."
            )
        )

    return {
        "message": "Concept practice generated successfully.",
        "interview_id": data.interview_id,
        "question_number": data.question_number,
        "original_question": original_question,
        "original_score": original_score,
        "understanding_status": "needs_improvement",
        "weak_concept": weak_concept.strip(),
        "concept_explanation": explanation.strip(),
        "reason": reason.strip(),
        "practice_questions": [
            question.strip()
            for question in practice_questions[:2]
        ]
    }
