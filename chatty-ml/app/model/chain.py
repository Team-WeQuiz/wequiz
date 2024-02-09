"""
TODO
- 챗봇 id에 따라 docs db의 path를 가져와야함
"""

from model.prompt import SYSTEM_PROMPT 
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from model.embedding import Embedding
from operator import itemgetter

# LLM 체인 클래스
class Chain():
    def __init__(self):
        self.vectorstore= FAISS.load_local('./data/faiss_index', embeddings=Embedding('query').model)
        self.retriever = self.vectorstore.as_retriever()
        self.llm = ChatOpenAI()
        self.prompt = ChatPromptTemplate.from_template(SYSTEM_PROMPT)
        self.output_parser = StrOutputParser()
        self.chain = (
            {"context": self.retriever, "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | self.output_parser 
          )  # Chain 구성
    
    # LLM inference 함수
    def inference(self, message, history):
        print(self.retriever.invoke(message))
        return self.chain.invoke(message)

