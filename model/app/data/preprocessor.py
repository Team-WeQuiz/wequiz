import tiktoken
import json
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders.parsers.pdf import (
    PDFMinerParser,
    PyMuPDFParser,
    PyPDFium2Parser,
)
from data.settings import *
from utils.security import get_minio_access_key
from data.loader import MinioLoader
from utils.logger import *
# 로깅 설정
setup_logging()


MINIO_ACCESS = json.loads(get_minio_access_key())

def remove_urls(text):
    url_pattern = re.compile(r'https?://\S+|www\.\S+')
    return url_pattern.sub('', text)

def is_valid_doc(text):
    invalids = ['REFERENCES', 'References', '참고문헌']

    for invalid in invalids:
        invalid_position = text.find(invalid)
        if invalid_position != -1: # invalid 키워드가 등장한 위치부터 끝까지 텍스트 제거
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
    def __init__(self):
        self.encoding = tiktoken.get_encoding("cl100k_base")
        self.parsers = [
            PyPDFium2Parser(extract_images=False),
            PyMuPDFParser(extract_images=False),
            PDFMinerParser(extract_images=False)
        ]

    def num_tokens_from_string(self, documents):
        return len(self.encoding.encode(documents))
    
    def split_docs(self, total_text, chunk_size, chunk_overlap):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len
        )
        splitted_text = text_splitter.split_text(total_text)
        splitted_docs = text_splitter.create_documents(splitted_text)
        return preprocess(splitted_docs)


    def get_parsed_docs(self, parser, loader, files):
        keyword_docs_list = []
        summary_docs_list = []
        vector_docs_list = []

        for file in files:
            file_obj = loader.load_file(file)
            documents = parser.lazy_parse(file_obj)

            # documents를 하나의 text로 병합
            total_text = ''
            page_num = 0
            for document in documents:
                total_text += document.page_content
                page_num += 1
            
            log('info', f'[preprocessor.py > line 89] 페이지 수: {page_num}')
            log('info', f'[preprocessor.py > line 90] 예상되는 토큰 수: {self.num_tokens_from_string(total_text)}')

            keyword_docs_list += self.split_docs(total_text, KEYWORD_CHUNK_SIZE, KEYWORD_CHUNK_OVERLAP)
            summary_docs_list += self.split_docs(total_text, SUMMARY_CHUNK_SIZE, SUMMARY_CHUNK_OVERLAP)
            vector_docs_list += self.split_docs(total_text, VECTOR_CHUNK_SIZE, VECTOR_CHUNK_OVERLAP)

        return keyword_docs_list, summary_docs_list, vector_docs_list


    # parse files
    def parse(self, user_id, timestamp):
        loader = MinioLoader(MINIO_ACCESS, BUCKET_NAME)
        minio_files = loader.get_list(user_id, timestamp, 'pdf')
        retry = 0

        while retry < PARSING_RETRY:
            try:
                # retry 횟수에 따라 파서 선정
                parser = self.parsers[retry%3]
                keyword_docs_list, summary_docs_list, vector_docs_list = self.get_parsed_docs(parser, loader, minio_files)
                break
            except Exception as e:
                log('warning', f"[preprocessor.py > line 112] An unexpected parsing error occurred: {e}")
                retry += 1
                continue
        
        log('info', f'[preprocessor.py > line 116] 키워드 추출을 위한 {len(keyword_docs_list)}개의 문서 조각이 준비되었습니다.')
        log('info', f'[preprocessor.py > line 117] 요약을 위한 {len(summary_docs_list)}개의 문서 조각이 준비되었습니다.')
        log('info', f'[preprocessor.py > line 118] 벡터화를 위한 {len(vector_docs_list)}개의 문서 조각이 준비되었습니다.')
        return keyword_docs_list, summary_docs_list, vector_docs_list
