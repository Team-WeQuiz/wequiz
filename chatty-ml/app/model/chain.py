import os
import yaml
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# LLM 체인 클래스
class Chain():
    def __init__(self):
        # Get Config
        with open('config.yaml', 'r') as file:
            self.config = yaml.safe_load(file)
            
        # Open AI API Key
        os.environ["OPENAI_API_KEY"] = self.config.get("OPENAI_API_KEY")

        self.llm = ChatOpenAI()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.config.get("SYSTEM_PROMPT")),
            ("user", "{input}")
        ])
        self.output_parser = StrOutputParser()
        self.chain = self.prompt | self.llm | self.output_parser   # Chain 구성
    
    # LLM inference 함수
    def inference(self, message, history):
        return self.chain.invoke({"input": message})

