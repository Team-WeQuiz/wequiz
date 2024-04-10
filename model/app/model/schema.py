from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List

# 문제 형식 정의
class ChoiceOutput(BaseModel):
    question: str = Field(description="question about keywords")
    choices: List[str] = Field(description="Five options for the problem. Among these, there is only one correct answer.")
    answer: str = Field(description="The correct option among the given choices")

class ShortOutput(BaseModel):
    question: str = Field(description="question about keywords")
    choices: List[str] = []  # 빈 리스트로 기본값 설정
    answer: str = Field(description="only a word as a correct answer.")