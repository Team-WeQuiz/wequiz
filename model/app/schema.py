from pydantic import BaseModel
from typing import List

class GenerateRequest(BaseModel):
    timestamp: str
    user_id: int
    num_of_quiz: int

class Answer(BaseModel):
    user_id: int # user_id
    user_answer: str # 유저가 작성한 답안

class MarkRequest(BaseModel):
    id: str  # **quiz_set** id
    timestamp: str # quiz방 생성 시간
    quiz_id: str 
    quiz_num: int
    quiz_type: str
    correct_answer: str  # 답안
    submit_answers: List[Answer]  # 제출 답안