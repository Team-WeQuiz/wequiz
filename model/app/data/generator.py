import uuid, random
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from model.chain import QuizPipeline
from data.settings import QUIZ_GENERATE_RETRY
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
    
    def set_options(self, type, option_list):
        if type == "OX퀴즈":
            return ["YES", "NO"]
        else:
            return option_list
    
    def generate(self, keyword, question_number):
        retry = 0
        while retry < QUIZ_GENERATE_RETRY:
            try:
                response = self.chain.generate_quiz(keyword)["quiz"]
                log("info", f'[generator.py > quiz] quiz generated. {response}')

                type = self.get_type(response["text"]["type"])
                options = self.set_options(type, response["text"]["choices"])
                if type == "OX퀴즈": type = "객관식"    # ox퀴즈도 객관식으로 설정

                data = {
                    "id": f'quiz-{uuid.uuid4()}',
                    "question_number": question_number,
                    "type": type,
                    "question": response["text"]["question"],
                    "options": options,
                    "correct": response["text"]["correct"]
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

    
#######################################################################################

from model.chain import MarkChain

class Marker():
    def __init__(self):
        self.marker_chain = MarkChain()
    
    def mark(self, answer, user):
        response = self.marker_chain.mark(answer, user)
        
        return 'true' in response['text'].lower()


########################################################################################

from model.chain import SummaryChain

class Summarizer():
    def __init__(self):
        self.summary_chain = SummaryChain()
    
    async def summarize(self, split_docs):
        response = await self.summary_chain.summary(split_docs)
        return response["output_text"]