"""
TODO
- type예 따라 적절한 임베딩 모델 선정해야함
"""

from langchain_openai import OpenAIEmbeddings
import os

# Get the OpenAI API key from the environment variable
openai_api_key = os.getenv("OPEN_API_KEY")
# from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings

class Embedding():
    def __init__(self, type:str):
        self.type = type
        """
        type = ['docs', 'query']
        docs: 문서 벡터화
        query: 사용자 질문 벡터화
        """
        if type == 'docs':
            self.model = OpenAIEmbeddings(openai_api_key=openai_api_key)
        else:
            self.model = OpenAIEmbeddings(openai_api_key=openai_api_key)