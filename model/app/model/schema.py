from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List

# 문제 형식 정의
class Output(BaseModel):
    question: str = Field(description="question about keywords")
    choices: List[str] = Field(description="Five options for the problem. Among these, there is only one correct answer.")
    answer: str = Field(description="The correct option among the given choices")