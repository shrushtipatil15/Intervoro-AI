
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.interview import router as interview_router
from app.routes.resume import router as resume_router
from app.routes.concept_transfer import (
    router as concept_transfer_router
)

app = FastAPI(
    title="AI Interview Bot API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
          "http://localhost:5173",
        "https://intervoro-ai-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication APIs
app.include_router(
    auth_router,
    prefix="/api/auth"
)

# Interview APIs
app.include_router(
    interview_router,
    prefix="/api/interview"
)

# Resume Analysis API
app.include_router(
    resume_router,
    prefix="/api/resume"
)

# Concept Transfer Verification API
app.include_router(
    concept_transfer_router,
    prefix="/api/concept-transfer"
)


@app.get("/")
def home():
    return {
        "message": "AI Interview Bot API Running"
    }
