from model.chain import Chain
from data.vectorizer import Vectorizer
from data.settings import QUIZ_GENERATE_RETRY
import uuid

class ProbGenerator():
    def __init__(self, split_docs, openai_api_key):
        self.openai_api_key = openai_api_key
        self.vectorizer = Vectorizer(openai_api_key)
        try:
            self.indices = self.vectorizer.convert(split_docs)
        except Exception as e:
            raise e
        self.chain = Chain(self.indices, self.openai_api_key)
    
    def generate(self, type, keyword, question_number):
        retry = 0
        types = ["객관식", "단답형", "주관식"]
        if type in [0, 1]: # 객관식, 단답형
            while retry < QUIZ_GENERATE_RETRY:
                try:
                    response = self.chain.prob(type, keyword)
                    data = {
                        "id": uuid.uuid4(),
                        "question_number": question_number,
                        "type": types[type],
                        "question": response["text"]["question"],
                        "options": response["text"]["choices"],
                        "answer": response["text"]["answer"]
                    }
                    break
                except KeyError:
                    print("retry generating quiz due to KeyError")
                    retry += 1
                    continue
                except Exception as e:
                    print(f"An unexpected error occurred: {e}")
                    retry += 1
                    continue
            return data
        
        else:
            raise NotImplementedError("주관식에 대한 chain을 구성해야합니다.")

    
       

    
