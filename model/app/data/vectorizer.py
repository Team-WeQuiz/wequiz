from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from utils.logger import log

class Vectorizer():
    def __init__(self, openai_api_key):
        self.db_url = 'data/faiss_index3'
        self.embedding = OpenAIEmbeddings(openai_api_key=openai_api_key)

        # text to vector convertor
    def vectorize(self, split_docs):
        try:
            self.db = FAISS.from_documents(split_docs, self.embedding)
            # self.db.as_retriever()
            self.db.save_local(self.db_url)
            return self.db_url
        except Exception as e:
            log('error', f'Failed to Save Vectors: {str(e)}')
            raise e

    
    def convert(self, split_docs):
        return self.vectorize(split_docs)