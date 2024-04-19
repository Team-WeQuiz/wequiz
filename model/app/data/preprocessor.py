import tiktoken, json, re
from langchain.text_splitter import RecursiveCharacterTextSplitter
from data.settings import BUCKET_NAME, CHUNK_SIZE, CHUNK_OVERLAP, PARSING_RETRY
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
    def __init__(self, user_id):
        self.user_id = user_id

    def num_tokens_from_string(self, documents) -> int:
        encoding = tiktoken.get_encoding("cl100k_base")

        total_tokens = 0
        for document in documents:
            num_tokens = len(encoding.encode(document.page_content))
            total_tokens += num_tokens

        print(f'예상되는 토큰 수: {total_tokens}')

        return total_tokens
    
    def split_docs(self, documents):
        
        doc_list = []
        for document in documents:
            doc_list.append(document)
        
        print(f'페이지 수: {len(doc_list)}')

        total_tokens = self.num_tokens_from_string(doc_list)

        # 결과 출력
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP, length_function=len)
        splitted_docs = text_splitter.split_documents(doc_list)

        return preprocess(splitted_docs)


    def get_parsed_docs(self, parser, loader, files):
        docs_list = []
        for file in files:
            file_obj = loader.load_file(file)

            # PDF 파싱
            documents = parser.lazy_parse(file_obj)

            splitted_docs = self.split_docs(documents)
            docs_list += splitted_docs

        return docs_list


    # parse files
    def parse(self):
        loader = MinioLoader(MINIO_ACCESS, BUCKET_NAME)
        minio_files = loader.get_list(self.user_id, 'pdf')
        parsers = [PyPDFium2Parser(extract_images=True), PyMuPDFParser(extract_images=True), PDFMinerParser(extract_images=True)]
        retry = 0

        while retry < PARSING_RETRY:
            try:
                # retry 횟수에 따라 파서 선정
                parser = parsers[retry%3]
                docs_list = self.get_parsed_docs(parser, loader, minio_files)
                break
            except Exception as e:
                print(f"An unexpected parsing error occurred: {e}")
                retry += 1
                continue
        
        print(f"총 {len(docs_list)}개의 문서 조각이 준비되었습니다.")
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