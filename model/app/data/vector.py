from langchain_community.vectorstores import FAISS
from model.embedding import Embedding
from utils.logger import log

class Vector():
    def __init__(self):
        self.db_url = 'data/faiss_index2'

        # text to vector convertor
    def vectorize(self, split_docs):
        # Create the vector store
        embedding = Embedding('docs')
        try:
            self.db = FAISS.from_documents(split_docs, embedding.model)
            # self.db.as_retriever()
            self.db.save_local(self.db_url)
            return self.db_url
        except Exception as e:
            log('error', f'Failed to Save Vectors: {str(e)}')
            raise e

    
    def convert(self, split_docs):
        return self.vectorize(split_docs)