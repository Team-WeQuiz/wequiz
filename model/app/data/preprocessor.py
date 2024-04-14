import tiktoken, json
from langchain.text_splitter import RecursiveCharacterTextSplitter
from data.settings import BUCKET_NAME, CHUNK_SIZE, CHUNK_OVERLAP
from utils.security import get_minio_access_key
from data.loader import MinioLoader
from langchain_community.document_loaders.parsers.pdf import (
    # PDFMinerParser,
    # PyMuPDFParser,
    PyPDFium2Parser,
)

MINIO_ACCESS = json.loads(get_minio_access_key())


class Parser():
    def __init__(self, user_id):
        self.user_id = user_id

    def num_tokens_from_string(self, string: str, encoding_name: str) -> int:
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens
    
    def split_docs(self, documents):
        # # 결과 출력
        # for document in documents:
        #     docs += document
        
            # print(f"페이지에 {len(document.page_content)}개의 단어를 가지고 있습니다.")
            # print(f'예상되는 토큰 수 {self.num_tokens_from_string(document.page_content, "cl100k_base")}')

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
        splitted_docs = text_splitter.split_documents(documents)
        return splitted_docs

    # parse files
    def parse(self):
        loader = MinioLoader(MINIO_ACCESS, BUCKET_NAME)
        minio_files = loader.get_list(self.user_id, 'pdf')

        # PyPDFParser 객체 초기화
        parser = PyPDFium2Parser(extract_images=True)

        docs_list = []
        for file in minio_files:
            file_obj = loader.load_file(file)

            # PDF 파싱
            documents = parser.lazy_parse(file_obj)

            splitted_docs = self.split_docs(documents)
            docs_list += splitted_docs
        
        print(f"총 {len(docs_list)}개의 페이지가 준비되었습니다.")
        return docs_list


##############################################################################

from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

class Vectorizer():
    def __init__(self, openai_api_key):
        self.embedding = OpenAIEmbeddings(openai_api_key=openai_api_key)

        # text to vector convertor
    def vectorize(self, split_docs):
        try:
            indices = FAISS.from_documents(split_docs, self.embedding)
            return indices
        except Exception as e:
            raise e

    
    def convert(self, split_docs):
        return self.vectorize(split_docs)