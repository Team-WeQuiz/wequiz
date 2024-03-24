from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

class Vectorizer():
    def __init__(self, openai_api_key):
        # self.db_url = 'data/faiss_index3'
        self.embedding = OpenAIEmbeddings(openai_api_key=openai_api_key)

        # text to vector convertor
    def vectorize(self, split_docs):
        try:
            indices = FAISS.from_documents(split_docs, self.embedding)
            # self.db.as_retriever()
            # indices.save_local(self.db_url)
            return indices
        except Exception as e:
            raise e

    
    def convert(self, split_docs):
        return self.vectorize(split_docs)