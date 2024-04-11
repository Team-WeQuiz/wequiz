import tiktoken, json, io
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import S3FileLoader
from data.settings import BUCKET_NAME, CHUNK_SIZE, CHUNK_OVERLAP
from utils.security import get_minio_access_key
from data.loader import MinioLoader
import urllib3
from langchain_community.document_loaders.parsers.pdf import (
    # AmazonTextractPDFParser,
    # DocumentIntelligenceParser,
    # PDFMinerParser,
    # PDFPlumberParser,
    # PyMuPDFParser,
    # PyPDFium2Parser,
    PyPDFParser,
)

MINIO_ACCESS = json.loads(get_minio_access_key())


class Splitter():
    def __init__(self, user_id):
        self.user_id = user_id

    def num_tokens_from_string(self, string: str, encoding_name: str) -> int:
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    # split docs
    def split_docs(self):
        loader = MinioLoader(MINIO_ACCESS, BUCKET_NAME)
        minio_files = loader.get_list(self.user_id, 'pdf')

        # PyPDFParser 객체 초기화
        parser = PyPDFParser(extract_images=True)

        docs = []
        for file in minio_files[:2]:
            file_obj = loader.load_file(file)

            # PDF 파싱
            documents = parser.lazy_parse(file_obj)

            # # 결과 출력
            # for document in documents:
            #     docs += document
            
                # print(f"페이지에 {len(document.page_content)}개의 단어를 가지고 있습니다.")
                # print(f'예상되는 토큰 수 {self.num_tokens_from_string(document.page_content, "cl100k_base")}')

            text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
            doc = text_splitter.split_documents(documents)
            print(doc)
            print(f"파일에 {len(doc)}개의 문서를 가지고 있습니다.")
            docs += doc

        print(f"총 {len(docs)}개의 페이지가 준비되었습니다.")
        return docs