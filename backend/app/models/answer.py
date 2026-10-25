from pydantic import BaseModel

class Answer(BaseModel):
    interview_id: str
    question_number: int
    answer: str