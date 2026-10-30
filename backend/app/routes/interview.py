
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from app.models.interview import InterviewCreate
from app.models.answer import Answer

from app.services.gemini_service import generate_questions
from app.services.evaluation_service import evaluate_answer

from app.dependencies import get_current_user

from app.database import (
    interviews_collection,
    answers_collection,
    reports_collection
)

router = APIRouter(tags=["Interview"])


# ==================================================
# Create Interview
# ==================================================

@router.post("/create")
async def create_interview(
    interview: InterviewCreate,
    current_user: dict = Depends(get_current_user)
):
    questions = generate_questions(
        interview.role,
        interview.experience,
        interview.difficulty,
        interview.technology,
        interview.number_of_questions
    )

    interview_data = {
        "user_id": current_user["id"],
        "role": interview.role,
        "experience": interview.experience,
        "difficulty": interview.difficulty,
        "technology": interview.technology,
        "number_of_questions": interview.number_of_questions,
        "questions": questions,
        "created_at": datetime.utcnow()
    }

    result = interviews_collection.insert_one(interview_data)

    return {
        "message": "Interview Created Successfully",
        "interview_id": str(result.inserted_id),
        "questions": questions
    }


# ==================================================
# Submit Answer
# ==================================================

@router.post("/answer")
async def submit_answer(
    data: Answer,
    current_user: dict = Depends(get_current_user)
):
    try:
        interview_id = ObjectId(data.interview_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid Interview ID"
        )

    interview = interviews_collection.find_one({
        "_id": interview_id,
        "user_id": current_user["id"]
    })

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    questions = interview.get("questions", [])

    if data.question_number < 1 or data.question_number > len(questions):
        raise HTTPException(
            status_code=400,
            detail="Invalid question number"
        )

    question = questions[data.question_number - 1]

    evaluation = evaluate_answer(question, data.answer)

    answer_data = {
        "interview_id": data.interview_id,
        "user_id": current_user["id"],
        "question_number": data.question_number,
        "question": question,
        "answer": data.answer,
        "score": evaluation["score"],
        "feedback": evaluation["feedback"],
        "submitted_at": datetime.utcnow()
    }

    answers_collection.insert_one(answer_data)

    return {
        "message": "Answer Submitted Successfully",
        "question": question,
        "evaluation": evaluation
    }


# ==================================================
# Generate Result and Save Report
# ==================================================

@router.get("/result/{interview_id}")
async def get_result(
    interview_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        object_id = ObjectId(interview_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid Interview ID"
        )

    interview = interviews_collection.find_one({
        "_id": object_id,
        "user_id": current_user["id"]
    })

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    answers = list(
        answers_collection.find({
            "interview_id": interview_id,
            "user_id": current_user["id"]
        }).sort("question_number", 1)
    )

    if not answers:
        raise HTTPException(
            status_code=404,
            detail="No answers found"
        )

    total_questions = len(answers)
    total_score = sum(answer["score"] for answer in answers)
    average_score = round(total_score / total_questions, 2)

    if average_score >= 9:
        grade = "A+"
    elif average_score >= 8:
        grade = "A"
    elif average_score >= 7:
        grade = "B"
    elif average_score >= 6:
        grade = "C"
    else:
        grade = "D"

    strengths = []
    weaknesses = []

    for answer in answers:
        if answer["score"] >= 8:
            strengths.append(answer["question"])
        else:
            weaknesses.append(answer["question"])

    report_data = {
        "interview_id": interview_id,
        "user_id": current_user["id"],
        "average_score": average_score,
        "total_score": total_score,
        "grade": grade,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "created_at": datetime.utcnow()
    }

    reports_collection.update_one(
        {
            "interview_id": interview_id,
            "user_id": current_user["id"]
        },
        {"$set": report_data},
        upsert=True
    )

    return {
        "message": "Report Generated Successfully",
        "interview_id": interview_id,
        "total_questions": total_questions,
        "total_score": total_score,
        "average_score": average_score,
        "grade": grade,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "answers": [
            {
                "question_number": answer["question_number"],
                "question": answer["question"],
                "answer": answer["answer"],
                "score": answer["score"],
                "feedback": answer["feedback"]
            }
            for answer in answers
        ]
    }


# ==================================================
# Get Saved Report
# ==================================================

@router.get("/report/{interview_id}")
async def get_report(
    interview_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        ObjectId(interview_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid Interview ID"
        )

    report = reports_collection.find_one({
        "interview_id": interview_id,
        "user_id": current_user["id"]
    })

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return {
        "report_id": str(report["_id"]),
        "interview_id": report["interview_id"],
        "average_score": report["average_score"],
        "total_score": report["total_score"],
        "grade": report["grade"],
        "strengths": report["strengths"],
        "weaknesses": report["weaknesses"],
        "created_at": report["created_at"]
    }


# ==================================================
# Get Interview History
# IMPORTANT: Keep this before /{interview_id}
# ==================================================

@router.get("/history")
async def get_interview_history(
    current_user: dict = Depends(get_current_user)
):
    interviews = list(
        interviews_collection.find({
            "user_id": current_user["id"]
        }).sort("created_at", -1)
    )

    history = []

    for interview in interviews:
        interview_id = str(interview["_id"])

        report = reports_collection.find_one({
            "interview_id": interview_id,
            "user_id": current_user["id"]
        })

        history.append({
            "interview_id": interview_id,
            "role": interview.get("role", "Mock Interview"),
            "experience": interview.get("experience", ""),
            "difficulty": interview.get("difficulty", ""),
            "technology": interview.get("technology", ""),
            "number_of_questions": interview.get(
                "number_of_questions", 0
            ),
            "created_at": interview.get("created_at"),
            "average_score": (
                report.get("average_score") if report else None
            ),
            "grade": report.get("grade") if report else None,
            "report_available": report is not None
        })

    return {"interviews": history}


# ==================================================
# Get Answered Questions for Concept Practice
# ==================================================

@router.get("/answered-questions/{interview_id}")
async def get_answered_questions(
    interview_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        object_id = ObjectId(interview_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid Interview ID"
        )

    interview = interviews_collection.find_one({
        "_id": object_id,
        "user_id": current_user["id"]
    })

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    saved_answers = list(
        answers_collection.find({
            "interview_id": interview_id,
            "user_id": current_user["id"]
        }).sort("submitted_at", -1)
    )

    # Include only question numbers that have saved answers.
    answered_numbers = {
        answer["question_number"]
        for answer in saved_answers
        if answer.get("question_number") is not None
    }

    questions = interview.get("questions", [])

    answered_questions = [
        {
            "question_number": number,
            "question": questions[number - 1]
        }
        for number in sorted(answered_numbers)
        if 1 <= number <= len(questions)
    ]

    return {
        "interview_id": interview_id,
        "total_questions": len(questions),
        "answered_count": len(answered_questions),
        "answered_questions": answered_questions
    }


# ==================================================
# Get Interview Details
# KEEP THIS LAST
# ==================================================

@router.get("/{interview_id}")
async def get_interview(
    interview_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        object_id = ObjectId(interview_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid Interview ID"
        )

    interview = interviews_collection.find_one({
        "_id": object_id,
        "user_id": current_user["id"]
    })

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return {
        "interview_id": str(interview["_id"]),
        "role": interview["role"],
        "experience": interview["experience"],
        "difficulty": interview["difficulty"],
        "technology": interview["technology"],
        "number_of_questions": interview["number_of_questions"],
        "questions": interview["questions"],
        "created_at": interview["created_at"]
    }
