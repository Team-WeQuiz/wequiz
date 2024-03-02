from re import template
from model.prompt import SYSTEM_PROMPT
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from operator import itemgetter
from typing import List
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.output_parsers import JsonOutputParser
from langchain_community.vectorstores import FAISS
from model.embedding import Embedding
from utils.logger import log

# 문제 형식 정의
class Question(BaseModel):
    question: str = Field(description="question about keywords")
    choices: List[str] = Field(description="Five options for the problem. Among these, there is only one correct answer.")
    answer: str = Field(description="The correct option among the given choices")

# LLM 체인 클래스
class Chain():
    def __init__(self, db_path):
        self.vectorstore= FAISS.load_local(db_path, embeddings=Embedding('query').model)
        self.retriever = self.vectorstore.as_retriever()
        self.llm = OpenAI()
        self.parser = JsonOutputParser(pydantic_object=Question)
        self.prompt = PromptTemplate(
            template=SYSTEM_PROMPT,
            input_variables=["message", "type"],
            partial_variables={"context": self.retriever, "format_instructions": self.parser.get_format_instructions()}
        )
        self.chain = self.prompt | self.llm | self.parser
        log('info', 'Setting Chain successfully.')
    
    # LLM inference 함수
    def inference(self, message, type):
        return self.chain.invoke({"message": message, "type": type})

