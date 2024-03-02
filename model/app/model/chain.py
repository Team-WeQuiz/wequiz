"""
TODO
- 챗봇 id에 따라 docs db의 path를 가져와야함
"""

from model.prompt import CHOICE_PROB_PROMPT, LONG_PROB_PROMPT, SHORT_PROB_PROMPT, KEY_EXCT_PROMPT
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from model.embedding import Embedding
from utils.logger import log

# LLM 체인 클래스
class Chain():
    def __init__(self, type):
        self.vectorstore= FAISS.load_local('./data/faiss_index2', embeddings=Embedding('query').model)
        self.retriever = self.vectorstore.as_retriever()
        self.llm = OpenAI()
        self.prompt = {
            "choice": PromptTemplate.from_template(CHOICE_PROB_PROMPT),
            "long": PromptTemplate.from_template(LONG_PROB_PROMPT),
            "short": PromptTemplate.from_template(SHORT_PROB_PROMPT)
        }
        self.output_parser = StrOutputParser()
        self.chain = (
            {"context": self.retriever, "message": RunnablePassthrough()}
            | self.prompt[type]
            | self.llm
            | self.output_parser 
          )  # Chain 구성
    
    # LLM inference 함수
    def inference(self, message, history=None):
        return self.chain.invoke(message)

