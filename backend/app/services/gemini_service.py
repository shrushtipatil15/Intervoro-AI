import os
import json
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Using Flash-Lite because it is lighter and generally more suitable
# for repeated API calls such as interview question generation.
MODEL_NAME = "gemini-3.5-flash-lite"


def clean_json_response(text):
    """Clean Gemini's response before converting it to JSON."""

    text = text.strip()

    if text.startswith("```json"):
        text = text[7:]

    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()


def send_to_gemini(prompt, max_retries=2):
    """
    Send a prompt using the Chat API.

    The Chat API is used instead of client.models.generate_content()
    to avoid the automatic function calling warning.
    """

    last_error = None

    for attempt in range(max_retries + 1):

        try:
            chat = client.chats.create(
                model=MODEL_NAME
            )

            response = chat.send_message(prompt)

            if not response or not response.text:
                raise ValueError("Gemini returned an empty response.")

            return response.text

        except Exception as e:
            last_error = e

            error_text = str(e)

            # Retry only temporary server/capacity errors.
            if "503" in error_text or "UNAVAILABLE" in error_text:

                if attempt < max_retries:
                    time.sleep(3)
                    continue

            raise last_error

    raise last_error


def generate_questions(
    role,
    experience,
    difficulty,
    technology,
    number_of_questions
):
    prompt = f"""
You are an expert technical interviewer.

Create an interview for the following candidate:

Role: {role}
Experience Level: {experience}
Difficulty: {difficulty}
Technology/Skills: {technology}
Number of Questions: {number_of_questions}

Generate exactly {number_of_questions} interview questions.

The questions should:
- Match the candidate's role
- Match the technology and skills
- Match the experience level
- Match the requested difficulty
- Be practical and interview-oriented
- Not contain answers
- Avoid duplicate questions

Return ONLY valid JSON in exactly this format:

{{
    "questions": [
        "Question 1",
        "Question 2",
        "Question 3"
    ]
}}

Do not include markdown.
Do not include anything outside the JSON.
"""

    text = send_to_gemini(prompt)

    text = clean_json_response(text)

    try:
        result = json.loads(text)

    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini returned invalid JSON for questions.\n"
            f"Response: {text}\n"
            f"Error: {e}"
        )

    if "questions" not in result:
        raise ValueError(
            "Gemini response does not contain 'questions'."
        )

    questions = result["questions"]

    if not isinstance(questions, list):
        raise ValueError(
            "Gemini 'questions' field is not a list."
        )

    if len(questions) != number_of_questions:
        raise ValueError(
            f"Expected {number_of_questions} questions, "
            f"but Gemini returned {len(questions)}."
        )

    return questions


def evaluate_answer(question, answer):

    prompt = f"""
You are an expert technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the candidate's answer.

Consider:

1. Technical correctness
2. Understanding of the concept
3. Completeness
4. Clarity
5. Practical understanding

Give a score out of 10.

Return ONLY valid JSON in exactly this format:

{{
    "score": 0,
    "feedback": "Detailed feedback about the answer.",
    "correct_answer": "A concise explanation of what a strong answer should contain."
}}

Rules:

- Score must be a number from 0 to 10.
- Give constructive feedback.
- Explain what the candidate did well.
- Explain what could be improved.
- The correct_answer should be concise but technically accurate.
- Do not include markdown.
- Do not include anything outside the JSON.
"""

    text = send_to_gemini(prompt)

    text = clean_json_response(text)

    try:
        result = json.loads(text)

    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini returned invalid JSON for evaluation.\n"
            f"Response: {text}\n"
            f"Error: {e}"
        )

    required_fields = [
        "score",
        "feedback",
        "correct_answer"
    ]

    for field in required_fields:
        if field not in result:
            raise ValueError(
                f"Gemini evaluation response is missing '{field}'."
            )

    return result
