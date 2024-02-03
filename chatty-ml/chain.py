import os
import yaml
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Get Config
with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)

# Open AI API Key
os.environ["OPENAI_API_KEY"] = config.get("OPENAI_API_KEY")

class Chain():
    def __init__(self):
        self._id = ''
        self.llm = ChatOpenAI()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "당신은 대한민국 고등학생을 가르치는 선생님입니다."),
            ("user", "{input}")
        ])
        self.output_parser = StrOutputParser()
        self.chain = self.prompt | self.llm | self.output_parser
    
    def inference(self, message, history):
        return self.chain.invoke({"input": message})

