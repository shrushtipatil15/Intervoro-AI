from app.services.gemini_service import generate_questions

print(
    generate_questions(
        "Python Developer",
        "Fresher",
        "Easy",
        ["Python", "FastAPI", "MongoDB"],
        5
    )
)