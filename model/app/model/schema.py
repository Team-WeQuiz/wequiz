from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List

class QuizOutput(BaseModel):
    type: str = Field(description="Selected question type")
    question: str = Field(description="question about context")
    choices: List[str] = Field(description="Multi options for the problem. Among these, there is only one correct answer. If it is a short-answer question without any options, please leave an empty list [].")
    correct: str = Field(description="The correct answer.")

# 문제 형식 정의
class ChoiceOutput(BaseModel):
    question: str = Field(description="question about context")
    choices: List[str] = Field(description="Five options for the problem. Among these, there is only one correct answer.")
    correct: str = Field(description="The correct option among the given choices")

class ShortOutput(BaseModel):
    question: str = Field(description="question about context")
    choices: List[str] = Field(description="please only empty list")  # 빈 리스트로 기본값 설정
    correct: str = Field(description="only a word as a correct answer.")