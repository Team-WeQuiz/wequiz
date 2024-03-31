from model.chain import Chain
from data.vectorizer import Vectorizer
import uuid

class ProbGenerator():
    def __init__(self, split_docs, openai_api_key):
        self.openai_api_key = openai_api_key
        self.vectorizer = Vectorizer(openai_api_key)
        try:
            self.indices = self.vectorizer.convert(split_docs)
        except Exception as e:
            raise e
        self.chain = Chain(self.indices, type, self.openai_api_key)
    
    def generate(self, type, keyword, question_number):
        if type == "객관식":
            response = self.chain.prob(keyword)
        else:
            raise NotImplementedError("주관식, 단답형에 대한 chain을 구성해야합니다.")
        
        data = {
                    "id": uuid.uuid4(),
                    "question_number": question_number,
                    "type": type,  # 1:객, 2:주, 3:단
                    "question": response["text"]["question"],
                    "options": response["text"]["choices"],
                    "answer": response["text"]["answer"]
            }
        
        return data
    
       

    
