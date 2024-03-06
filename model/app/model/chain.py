from re import template
from model.prompt import SYSTEM_PROMPT
from model.schema import Output
from model.embedding import Embedding
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.memory import VectorStoreRetrieverMemory
from langchain_community.vectorstores import FAISS
from langchain.chains import LLMChain

# LLM 체인 클래스
class Chain():
    def __init__(self, db_path, type):
        self.vectorstore= FAISS.load_local(db_path, embeddings=Embedding('query').model)
        self.retriever = self.vectorstore.as_retriever(search_kwargs=dict(k=3))
        self.llm = OpenAI()
        self.parser = JsonOutputParser(pydantic_object=Output)
        self.prompt = PromptTemplate(
            template=SYSTEM_PROMPT,
            input_variables=["message"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )
        self.memory = VectorStoreRetrieverMemory(retriever=self.retriever)
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt, memory=self.memory, output_parser=self.parser)
    
    # LLM inference 함수
    def inference(self, message):
        return self.chain.invoke(message)

