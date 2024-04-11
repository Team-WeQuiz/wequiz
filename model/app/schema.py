from pydantic import BaseModel
from typing import List

class GenerateRequest(BaseModel):
    timestamp: str
    user_id: int
    numOfQuiz: int

class Answer(BaseModel):
    user_id: int # user_id
    user: str # 유저가 작성한 답안

class MarkRequest(BaseModel):
    id: str  # quiz_set id
    quiz_id: str # quiz_id
    question_number: int # 퀴즈방 내에서의 quiz number
    correct: str # 답안
    answers: List[Answer]