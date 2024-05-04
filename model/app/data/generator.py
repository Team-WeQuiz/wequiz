import uuid, random
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from model.chain import Chain
from data.settings import QUIZ_GENERATE_RETRY
from utils.logger import *
# 로깅 설정
setup_logging()

class QuizGenerator():
    def __init__(self, split_docs):
        self.embedding = OpenAIEmbeddings(model="text-embedding-3-large")
        try:
            self.indices = FAISS.from_documents(split_docs, self.embedding)
        except Exception as e:
            raise e
        self.chain = Chain(self.indices)
    
    def generate(self, keyword, question_number):
        retry = 0
        types = ["객관식", "단답형"]
        # Randomly select type (0: multiple choice, 1: short answer, 2: OX quiz)
        type = random.randrange(0, 2)

        while retry < QUIZ_GENERATE_RETRY:
            try:
                response = self.chain.prob(type, keyword)
                data = {
                    "id": f'quiz-{uuid.uuid4()}',
                    "question_number": question_number,
                    "type": types[type],
                    "question": response["text"]["question"],
                    "options": response["text"]["choices"],
                    "correct": response["text"]["correct"]
                }
                break
            except KeyError:
                log("warning", "[generator.py > line 37] retry generating quiz due to KeyError")
                retry += 1
                continue
            except Exception as e:
                log("warning", f"[generator.py > line 41] An unexpected quiz generate error occurred: {e}")
                retry += 1
                continue
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
        return response["output_text"], response["intermediate_steps"]