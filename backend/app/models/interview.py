from pydantic import BaseModel
from typing import List


class InterviewCreate(BaseModel):
    role: str
    experience: str
    difficulty: str
    technology: List[str]
    number_of_questions: int