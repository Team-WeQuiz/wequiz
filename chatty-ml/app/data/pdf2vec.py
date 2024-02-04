import faiss
import tiktoken

from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

class Pdf2Vec():
    def __init__(self):
        # get file
       self.file = "dummyData/초거대 언어모델 연구 동향.pdf"

    def num_tokens_from_string(self, string: str, encoding_name: str) -> int:
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    # pdf parser
    def pdf2txt(self, file_path):
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
    def txt2vec(self, texts):
        # # Create the vector store
        # store = FAISS.from_texts([text.page_content for text in texts], OpenAIEmbeddings(openai_api_key=openai_api_key))
        vector = texts
        return vector
    
    def convert(self):
        texts = self.pdf2txt(self.file)
        vector = self.txt2vec(texts)


converter = Pdf2Vec()
converter.convert()