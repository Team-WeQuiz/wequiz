import tiktoken, json, re
from langchain.text_splitter import RecursiveCharacterTextSplitter
from data.settings import *
from utils.security import get_minio_access_key
from data.loader import MinioLoader
from langchain_community.document_loaders.parsers.pdf import (
    PDFMinerParser,
    PyMuPDFParser,
    PyPDFium2Parser,
)

MINIO_ACCESS = json.loads(get_minio_access_key())

def remove_urls(text):
    # Define the regex pattern to match URLs
    url_pattern = re.compile(r'https?://\S+|www\.\S+')
    # Replace URLs with an empty string
    text_without_urls = url_pattern.sub('', text)
    return text_without_urls

def is_valid_doc(text):
    invalids = [
        'REFERENCES',
        'References',
        '참고문헌',
    ]

    for invalid in invalids:
        invalid_position = text.find(invalid)
        if invalid_position != -1:
            # invalid 키워드가 등장한 위치부터 끝까지 텍스트 제거
            text = text[:invalid_position]

    return text

def preprocess(docs):
    clean_docs = []

    for doc in docs:
        text_without_urls = remove_urls(doc.page_content)
        valid_checked_text = is_valid_doc(text_without_urls)
        if valid_checked_text != text_without_urls:
            doc.page_content = valid_checked_text
            clean_docs.append(doc)
            break
        else:
            doc.page_content = text_without_urls
            clean_docs.append(doc)

    return clean_docs


class Parser():
    def __init__(self, user_id, timestamp):
        self.user_id = user_id
        self.timestamp = timestamp

    def num_tokens_from_string(self, documents) -> int:
        encoding = tiktoken.get_encoding("cl100k_base")

        total_tokens = len(encoding.encode(documents))

        return total_tokens
    
    def split_docs(self, total_text, chunk_size, chunk_overlap):

        # 결과 출력
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len)
        splitted_text = text_splitter.split_text(total_text)
        splitted_docs = text_splitter.create_documents(splitted_text)

        return preprocess(splitted_docs)


    def get_parsed_docs(self, parser, loader, files):
        summary_docs_list = []
        vector_docs_list = []

        for file in files:
            file_obj = loader.load_file(file)

            # PDF 파싱
            documents = parser.lazy_parse(file_obj)

            # documents를 하나의 text로 병합
            total_text = ''
            page_num = 0
            for document in documents:
                total_text += document.page_content
                page_num += 1
            
            print(f'페이지 수: {page_num}')
            print(f'예상되는 토큰 수: {self.num_tokens_from_string(total_text)}')

            summary_docs_list += self.split_docs(total_text, SUMMARY_CHUNK_SIZE, SUMMARY_CHUNK_OVERLAP)
            vector_docs_list += self.split_docs(total_text, VECTOR_CHUNK_SIZE, VECTOR_CHUNK_OVERLAP)

        return summary_docs_list, vector_docs_list


    # parse files
    def parse(self):
        loader = MinioLoader(MINIO_ACCESS, BUCKET_NAME)
        minio_files = loader.get_list(self.user_id, self.timestamp, 'pdf')
        parsers = [PyPDFium2Parser(extract_images=False), PyMuPDFParser(extract_images=False), PDFMinerParser(extract_images=False)]
        retry = 0

        while retry < PARSING_RETRY:
            try:
                # retry 횟수에 따라 파서 선정
                parser = parsers[retry%3]
                summary_docs_list, vector_docs_list = self.get_parsed_docs(parser, loader, minio_files)
                break
            except Exception as e:
                print(f"An unexpected parsing error occurred: {e}")
                retry += 1
                continue
        
        print(f"요약을 위한 {len(summary_docs_list)}개의 문서 조각이 준비되었습니다.")
        print(f"벡터화를 위한 {len(vector_docs_list)}개의 문서 조각이 준비되었습니다.")
        return summary_docs_list, vector_docs_list


##############################################################################

from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

class Vectorizer():
    def __init__(self):
        self.embedding = OpenAIEmbeddings(model="text-embedding-3-large")

        # text to vector convertor
    def vectorize(self, split_docs):
        try:
            indices = FAISS.from_documents(split_docs, self.embedding)
            return indices
        except Exception as e:
            raise e

    
    def convert(self, split_docs):
        return self.vectorize(split_docs)