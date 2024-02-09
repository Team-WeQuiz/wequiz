from model.prompt import SYSTEM_PROMPT 
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# LLM 체인 클래스
class Chain():
    def __init__(self):
        self.llm = ChatOpenAI()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("user", "{input}")
        ])
        self.output_parser = StrOutputParser()
        self.chain = self.prompt | self.llm | self.output_parser   # Chain 구성
    
    # LLM inference 함수
    def inference(self, message, history):
        return self.chain.invoke({"input": message})

