import uuid

import asyncio
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

from model.chain import QuizPipeline
from data.settings import *
from utils.logger import *
from utils.exception import *
# 로깅 설정
setup_logging()

class QuizGenerator():
    def __init__(self, split_docs):
        self.embedding = OpenAIEmbeddings(model="text-embedding-3-large")
        try:
            self.indices = FAISS.from_documents(split_docs, self.embedding)
        except Exception as e:
            raise e
        self.chain = QuizPipeline(self.indices)
    
    def get_type(self, text):
        # self.types = ['1. Multiple choice', '2. Short answer type that can be easily answered in one word', '3. yes/no quiz']
        if '1' in text.lower() or 'multi' in text.lower():
            return "객관식"
        elif '2' in text.lower() or 'short' in text.lower():
            return "단답형"
        elif '3' in text.lower() or ('yes' in text.lower() and 'no' in text.lower()):
            return "OX퀴즈"
    
    def adjust_result(self, type, option_list, correct):
        log("warning", f"[generator.py > quiz] set type({type}), options({option_list}), correct({correct}) ")
        if type == "단답형":
            if (correct.strip().lower() in NO_LIST) or (correct.strip().lower() in YES_LIST):
                type = "OX퀴즈"
        if type == "OX퀴즈":
            option_list = ["YES", "NO"]
            if correct.strip().lower() in YES_LIST:
                correct = 'YES'
            elif correct.strip().lower() in NO_LIST:
                correct = 'NO'
            else:
                raise QuizGenerationException(f'correct({correct}) does not belong anywhere.')
        
        if type == "OX퀴즈": type = "객관식"    # ox퀴즈도 객관식으로 설정
        if type is None:   # type이 None인 경우 예외처리
            if len(option_list) == 0:
                type = "단답형"
            else:
                type = "객관식"
        
        if type == "객관식":
            if len(option_list) <= 1:
                raise QuizGenerationException(f"Generated options insufficient. length: {len(option_list)}")

        return type, option_list, correct
    
    def generate(self, keyword, question_number):
        retry = 0
        while retry < QUIZ_GENERATE_RETRY:
            try:
                response = self.chain.generate_quiz(keyword)["quiz"]
                log("info", f'[generator.py > quiz] quiz generated. {response}')

                question = response["text"]["question"]
                if len(question) <= QUIZ_LENGTH_MIN_LIMIT:
                    raise QuizGenerationException(f"Generated quiz is shorter than threshold({QUIZ_LENGTH_MIN_LIMIT}). length: {len(question)}")

                type, options, correct = self.adjust_result(
                    self.get_type(response["text"]["type"]), 
                    response["text"]["choices"], 
                    response["text"]["correct"]
                )

                data = {
                    "id": f'quiz-{uuid.uuid4()}',
                    "question_number": question_number,
                    "type": type,
                    "question": question,
                    "options": options,
                    "correct": correct,
                }
                break
            except KeyError:
                log("warning", "[generator.py > quiz] retry generating quiz due to KeyError")
                retry += 1
            except Exception as e:
                log("warning", f"[generator.py > quiz] An unexpected quiz generate error occurred: {e}")
                retry += 1

        if retry == QUIZ_GENERATE_RETRY:
            raise QuizGenerationException(f"Failed to generate quiz about [{keyword}] after {QUIZ_GENERATE_RETRY} retries.")
        return data
    
    async def generate_async(self, keyword, question_number):
        # 비동기 작업을 수행하는 별도의 메서드
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.generate, keyword, question_number)

    
#######################################################################################

from model.chain import MarkChain

class Marker():
    def __init__(self):
        self.marker_chain = MarkChain()
    
    async def mark(self, answer, user):
        if user.strip() == '':
            return False
        else:
            response = await self.marker_chain.mark(answer, user)
            if isinstance(response, dict) and 'text' in response:
                return 'true' in response['text'].lower()
            else:
                raise ValueError("Unexpected response format from marker_chain.mark()")


########################################################################################

from model.chain import SummaryChain

class Summarizer():
    def __init__(self):
        self.summary_chain = SummaryChain()
    
    async def summarize(self, split_docs):
        response = await self.summary_chain.summary(split_docs)
        return response["output_text"]