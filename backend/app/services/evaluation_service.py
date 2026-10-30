import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types


# ============================================================
# Environment
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from the environment."
    )


# ============================================================
# Gemini Client
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# Stable Gemini model
MODEL_NAME = "gemini-3.5-flash-lite"


# ============================================================
# Gemini Request
# ============================================================

def send_to_gemini(prompt, max_retries=1):

    last_error = None

    for attempt in range(max_retries + 1):

        try:

            response = client.models.generate_content(

                model=MODEL_NAME,

                contents=prompt,

                config=types.GenerateContentConfig(

                    temperature=0.2,

                    response_mime_type="application/json"

                )

            )


            if response is None:

                raise ValueError(
                    "Gemini returned no response."
                )


            text = response.text


            if not text:

                raise ValueError(
                    "Gemini returned an empty response."
                )


            return text.strip()


        except Exception as e:

            last_error = e

            error_text = str(e)

            print(
                f"Gemini evaluation error "
                f"(attempt {attempt + 1}): {error_text}"
            )


            # Do not retry quota errors
            if (
                "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
            ):

                raise


            # Retry temporary availability errors
            if (
                "503" in error_text
                or "UNAVAILABLE" in error_text
            ):

                if attempt < max_retries:

                    time.sleep(3)

                    continue


            raise


    raise last_error


# ============================================================
# Evaluate Candidate Answer
# ============================================================

def evaluate_answer(question, answer):

    prompt = f"""
You are an expert technical interviewer.

Evaluate the candidate's answer to the interview question below.

INTERVIEW QUESTION:
{question}

CANDIDATE ANSWER:
{answer}

Evaluate the answer using these criteria:

1. Technical correctness
2. Understanding of the concept
3. Completeness
4. Clarity
5. Practical understanding

Give a score from 0 to 10.

Scoring guidance:

0-2 = Completely incorrect or irrelevant
3-4 = Very weak understanding
5-6 = Basic understanding with important gaps
7-8 = Good answer with minor gaps
9 = Very strong answer
10 = Excellent, complete and technically accurate answer

Return ONLY a JSON object with exactly these fields:

{{
    "score": 0,
    "feedback": "Detailed constructive feedback.",
    "correct_answer": "A concise explanation of what an excellent answer should contain."
}}

Rules:

- score must be a number between 0 and 10.
- feedback must explain what the candidate did well.
- feedback must also explain what could be improved.
- correct_answer must be concise and technically accurate.
- Do not use markdown.
- Do not include anything outside the JSON object.
"""


    text = send_to_gemini(prompt)


    # ========================================================
    # Parse JSON
    # ========================================================

    try:

        result = json.loads(text)

    except json.JSONDecodeError:

        # Try extracting a JSON object if the model
        # unexpectedly returned surrounding text.

        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1:

            json_text = text[start:end + 1]

            try:

                result = json.loads(json_text)

            except json.JSONDecodeError as e:

                raise ValueError(
                    "Gemini returned invalid JSON.\n"
                    f"Response: {text}\n"
                    f"Error: {e}"
                )

        else:

            raise ValueError(
                "Gemini returned invalid JSON.\n"
                f"Response: {text}"
            )


    # ========================================================
    # Validate Required Fields
    # ========================================================

    required_fields = [
        "score",
        "feedback",
        "correct_answer"
    ]


    for field in required_fields:

        if field not in result:

            raise ValueError(
                f"Gemini evaluation response is missing "
                f"'{field}'.\n"
                f"Response: {result}"
            )


    # ========================================================
    # Validate Score
    # ========================================================

    try:

        score = float(result["score"])

    except (TypeError, ValueError):

        raise ValueError(
            f"Invalid score returned by Gemini: "
            f"{result['score']}"
        )


    if score < 0:

        score = 0

    if score > 10:

        score = 10


    # Keep integer scores as integers
    if score.is_integer():

        score = int(score)


    result["score"] = score


    # Make sure text fields are strings

    result["feedback"] = str(
        result["feedback"]
    )

    result["correct_answer"] = str(
        result["correct_answer"]
    )


    return result