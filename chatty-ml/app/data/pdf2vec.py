import os
import tiktoken
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from model.embedding import Embedding

class Pdf2Vec():
    def __init__(self):
       self.db_path = 'data/faiss_index2'

    def num_tokens_from_string(self, string: str, encoding_name: str) -> int:
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    # pdf parser
    def parse_pdf(self, file_path):
        loader = PyMuPDFLoader(file_path)
        data = loader.load()
        print(f"{len(data)}개의 페이지를 가지고 있습니다.")
        print(f"페이지에 {len(data[0].page_content)}개의 단어를 가지고 있습니다.")
        print(f'예상되는 토큰 수 {self.num_tokens_from_string(data[0].page_content, "cl100k_base")}')

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(data)
        print(f"파일에 {len(docs)}개의 문서를 가지고 있습니다.")

        return docs
    
    # text to vector convertor
    def save_vectors(self, docs):
        # # Create the vector store
        embedding = Embedding('docs')
        self.db = FAISS.from_documents(docs, embedding.model)
        # self.db.as_retriever()
        self.db.save_local(self.db_path)
        return self.db_path
    
    def convert(self, file_path):
        docs = self.parse_pdf(file_path)
        return self.save_vectors(docs)