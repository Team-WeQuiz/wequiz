"""
TODO
- type예 따라 적절한 임베딩 모델 선정해야함
"""

from langchain_openai import OpenAIEmbeddings
# from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings

class Embedding():
    def __init__(self, type:str):
        self.type = type
    
    def get_model(self):
        """
        type = ['docs', 'query']
        docs: 문서 벡터화
        query: 사용자 질문 벡터화
        """
        if self.type == 'docs':
            return OpenAIEmbeddings()
        else:
            return OpenAIEmbeddings()