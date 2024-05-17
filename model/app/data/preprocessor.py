import json
import re
from concurrent.futures import ThreadPoolExecutor

import tiktoken
import asyncio
import spacy
from konlpy.tag import Okt
from langdetect import detect
from langchain_core.documents import Document
from langchain_community.document_loaders.parsers.pdf import (
    PDFMinerParser,
    PyMuPDFParser,
    PyPDFium2Parser,
)

from data.settings import *
from utils.security import get_minio_access_key
from data.loader import MinioLoader
from utils.logger import *
from utils.exception import *
# 로깅 설정
setup_logging()


MINIO_ACCESS = json.loads(get_minio_access_key())

def remove_urls(text):
    url_pattern = re.compile(r'https?://\S+|www\.\S+')
    return url_pattern.sub('', text)

def is_valid_doc(text):
    invalids = ['REFERENCES', 'References', '참고문헌']
    is_valid = True
    for invalid in invalids:
        invalid_position = text.find(invalid)
        if invalid_position != -1: # invalid 키워드가 등장한 위치부터 끝까지 텍스트 제거
            text = text[:invalid_position]
            is_valid = False
    return text, is_valid

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
    
    def load_and_parse_files(self, parser, loader, files):
        # 파일 로딩 및 파싱 작업
        page_num = 0
        total_token = 0
        total_text = ''
        for file in files:
            try:
                file_obj = loader.load_file(file)
                documents = parser.lazy_parse(file_obj)
            except Exception as e:
                raise ParsingException(f"Error processing file {file}") from e
            for document in documents:
                total_text += document.page_content + '\\n'
                page_num += 1
            total_token += self.num_tokens_from_string(total_text)
            if total_token < MIN_TOKEN_LIMIT:
                raise InsufficientException(f"Insufficient token count. Found {total_token}, required at least {MIN_TOKEN_LIMIT}.")
        # 결과 반환
        return total_text, page_num, total_token


    async def get_parsed_docs_async(self, parser, loader, files):
        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            try:
                total_text, page_num, total_token = await loop.run_in_executor(
                    pool, self.load_and_parse_files, parser, loader, files
                )
            except Exception as e:
                raise ParsingException(f"Unexpected error occurred during parsing") from e

        log('info', f'[preprocessor.py > Parser] 파일 수: {len(files)}')
        log('info', f'[preprocessor.py > Parser] 페이지 수: {page_num}')
        log('info', f'[preprocessor.py > Parser] 예상되는 토큰 수: {total_token}')
        return total_text


    # parse files
    async def parse(self, user_id, timestamp):
        try:
            loader = MinioLoader(MINIO_ACCESS, BUCKET_NAME)
            minio_files = loader.get_list(user_id, timestamp, 'pdf')
            if not minio_files:
                raise FileNotFoundError(f"No files found in Minio for user_id: {user_id}, timestamp: {timestamp}")
        except FileNotFoundError as e:
            raise e
        except MinioException as e:
            raise e
        except Exception as e:
            raise e
        
        retry = 0
        while retry < PARSING_RETRY:
            try:
                # retry 횟수에 따라 파서 선정
                parser = self.parsers[retry%3]
                total_text = await self.get_parsed_docs_async(parser, loader, minio_files)

                textsplitter = TextSplitter()
                sentences = await textsplitter.split_sentences_async(total_text)

                # 병렬 처리 실행
                keyword_docs_task = asyncio.create_task(textsplitter.split_docs_async(sentences, KEYWORD_CHUNK_SIZE, KEYWORD_SENTENCE_OVERLAP))
                summary_docs_task = asyncio.create_task(textsplitter.split_docs_async(sentences, SUMMARY_CHUNK_SIZE, SUMMARY_SENTENCE_OVERLAP))
                vector_docs_task = asyncio.create_task(textsplitter.split_docs_async(sentences, VECTOR_CHUNK_SIZE, VECTOR_SENTENCE_OVERLAP))

                # 병렬 처리 결과 대기 및 반환
                keyword_docs_list, summary_docs_list, vector_docs_list = await asyncio.gather(
                    keyword_docs_task, summary_docs_task, vector_docs_task
                )
                
                break
            except ParsingException as e:
                log('warning', f"[preprocessor.py > Parser] An unexpected parsing error occurred: {e}")
                retry += 1
            except Exception as e:
                raise e
        
        if retry == PARSING_RETRY:
            raise ParsingException(f"Failed to parse documents after {PARSING_RETRY} retries.")
        
        log('info', f'[preprocessor.py > Parser] 키워드 추출을 위한 {len(keyword_docs_list)}개의 문서 조각이 준비되었습니다.')
        log('info', f'[preprocessor.py > Parser] 요약을 위한 {len(summary_docs_list)}개의 문서 조각이 준비되었습니다.')
        log('info', f'[preprocessor.py > Parser] 벡터화를 위한 {len(vector_docs_list)}개의 문서 조각이 준비되었습니다.')
        return keyword_docs_list, summary_docs_list, vector_docs_list, sentences


class TextSplitter():
    def split_sentences(self, total_text):
        lang = detect(total_text[:100])
        if lang == "ko":
            # Okt로 total_text를 형태소 단위로 분석
            okt = Okt()
            morphs = okt.morphs(total_text, stem=True)
            
            # 형태소 분석 결과를 바탕으로 문장 분리
            sentences = []
            current_sentence = []
            for morph in morphs:
                current_sentence.append(morph)
                if morph in ['.', '!', '?']:
                    sentences.append(' '.join(current_sentence))
                    current_sentence = []
            if current_sentence:
                sentences.append(' '.join(current_sentence))
        else:
            # Spacy로 total_text를 문장 단위 분리
            nlp = spacy.blank(lang)
            nlp.add_pipe('sentencizer')
            doc = nlp(total_text)
            sentences = [sent.text.strip() for sent in doc.sents]
        
        log('info', f'[preprocessor.py > TextSplitter] splitted_sentences: {len(sentences)}')
        return sentences

    def split_docs(self, sentences, chunk_size, sentence_overlap):
        chunks = []
        current_chunk = []
        current_chunk_length = 0

        for sentence in sentences:
            # 문장 전처리
            sentence = remove_urls(sentence)
            sentence, is_valid = is_valid_doc(sentence)

            # is_valid_doc 함수에서 invalids 키워드가 발견되면 청크 생성 중단
            if not is_valid:
                break

            # 현재 청크에 문장 추가
            if len(sentence.strip()) > MIN_SENTENCE_LENGTH:
                sentence_length = len(sentence.strip())

                # 현재 청크 길이와 새로운 문장 길이의 합이 chunk_size를 초과하는 경우
                if current_chunk_length + sentence_length > chunk_size:
                    # 현재 청크를 chunks에 추가
                    chunk = " ".join(current_chunk)
                    chunks.append(Document(chunk))

                    # 새로운 청크 시작
                    if sentence_overlap > 0:
                        current_chunk = current_chunk[-sentence_overlap:]
                    else:
                        current_chunk = []
                    current_chunk_length = sum(len(s) for s in current_chunk)

                # 문장을 현재 청크에 추가
                current_chunk.append(sentence)
                current_chunk_length += sentence_length

        # 마지막 청크 추가
        if current_chunk:
            chunk = " ".join(current_chunk)
            if len(chunk.strip()) > 3:
                chunks.append(Document(chunk))

        log('info', f'[preprocessor.py > TextSplitter] splitted_chunks: {len(chunks)}')
        return chunks
    
    async def split_sentences_async(self, total_text):
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.split_sentences, total_text)
    
    async def split_docs_async(self, sentences, chunk_size, chunk_overlap):
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.split_docs, sentences, chunk_size, chunk_overlap)


    # todo: get dynamic chunk size
    # def get_chunk_size(self, min_size, max_size):
    #     num_sentences = len(self.sentences)
    #     if num_sentences <= 100:
    #         return min_size
    #     elif num_sentences <= 500:
    #         return min_size + (max_size - min_size) // 3
    #     elif num_sentences <= 1000:
    #         return min_size + 2 * (max_size - min_size) // 3
    #     else:
    #         return max_size