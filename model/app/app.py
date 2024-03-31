from fastapi import FastAPI
from pydantic import BaseModel 
from data.splitter import Splitter
from data.prob_generator import ProbGenerator
from data.summarizer import Summarizer
from data.marker import Marker
from typing import List
from utils.logger import log
from utils.security import get_openai_api_key, get_aws_access_key
import json
import boto3

app = FastAPI()

# # Pydantic model for request body validation
# class ProbRequest(BaseModel):
#     timestamp: str
#     id: int
#     message: str
#     indices: object
#     type: str  # "객관식", "주관식", "단답형"

class GenerateRequest(BaseModel):
    id: int
    numOfQuiz: int
    type: str
    files: List[str]

class MarkRequest(BaseModel):
    id: int
    answer: str
    user: str

### credential key
OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
AWS_ACCESS_KEY = json.loads(get_aws_access_key())

## DynamoDB
REGION_NAME = 'ap-northeast-2'
TABLE_NAME = 'wequiz-quiz'
dynamodb = boto3.client('dynamodb', region_name=REGION_NAME)


@app.post("/mark")
def mark(mark_request: MarkRequest):
    marker = Marker(OPENAI_API_KEY)
    try:
        marking = marker.mark(mark_request.answer, mark_request.user)
        data = {
            "id": mark_request.id,
            "answer": mark_request.answer,
            "user": mark_request.user,
            "marking": marking
        }
        return data
    except Exception as e:
        log('error', f'Failed to Mark answer: {str(e)}', AWS_ACCESS_KEY)
        raise e


@app.post("/generate")
def generate(generate_request: GenerateRequest):
    #### parsing and split file ####
    splitter = Splitter(generate_request.files, AWS_ACCESS_KEY)
    try:
        split_docs = splitter.split_docs()
    except Exception as e:
        log('error', f'Failed to Parsing and Split PDF: {str(e)}', AWS_ACCESS_KEY)
        raise e

    #### generate description ####
    summarizer = Summarizer(OPENAI_API_KEY)
    try:
        summary = summarizer.summarize(split_docs)
        yield summary
    except Exception as e:
        log('error', f'Failed to Summarize PDF: {str(e)}', AWS_ACCESS_KEY)
        raise e

    #### generate quiz ###
    prob_generator = ProbGenerator(split_docs, OPENAI_API_KEY)
    #### NotImplemented keyword part ####
    keywords = ["원핫인코딩"] * generate_request.numOfQuiz
    questions = []
    #####################################
    for idx, keyword in enumerate(keywords):
        try:
            generated_prob = prob_generator.generate(generate_request.type, keyword, idx+1)
            questions.append(generated_prob)
            yield generated_prob
        except Exception as e:
            log('error', f'Failed to Generate Quiz {idx}-{keyword}: {str(e)}', AWS_ACCESS_KEY)
            raise e

    ### TODO ###
    # dynamoDB 스키마 형턔로 바꿔주는 func
    # dynamoDB에 push하며 끝

# unused
# def generate_prob(prob: ProbRequest):
#     try:
#         chain = Chain(prob.indices, prob.type, OPENAI_API_KEY)
#         response = chain.prob(prob.message)
#         log('info', f'Prob Chain inference is successed.', AWS_ACCESS_KEY)

#         print(f'prob.timestamp: {prob.timestamp}')

#         # DynamoDB에 삽입할 데이터 구성
#         data = {
#             "id": {"S": str(prob.id)},  # id를 문자열로 변환하여 저장
#             "timestamp": {"S": prob.timestamp},  # 변환하지 않고 그대로 사용
#             "day": {"N": str(datetime.datetime.strptime(prob.timestamp, "%Y-%m-%d %H:%M:%S").day)},
#             "month": {"N": str(datetime.datetime.strptime(prob.timestamp, "%Y-%m-%d %H:%M:%S").month)},
#             "year": {"N": str(datetime.datetime.strptime(prob.timestamp, "%Y-%m-%d %H:%M:%S").year)},
#             "questions": {"L": [
#                 {
#                     "M": {
#                         "id": {"S": str(uuid.uuid4())},
#                         "question_number": {"N": "1"},
#                         "type": {"S": str(prob.type)}, 
#                         "question": {"S": response["text"]["question"]},
#                         "options": {"L": [{"S": option} for option in response["text"]["choices"]]},
#                         "answer": {"S": response["text"]["answer"]}
#                     }
#                 }
#             ]},
#             "description": {"S": 'not yet'}
#         }

#         # DynamoDB에 데이터 삽입
#         dynamodb.put_item(
#             TableName=TABLE_NAME,
#             Item=data
#         )

#         res = {
#             "id": prob.id,
#             "questions":
#             [
#                 {
#                     "id": uuid.uuid4(),
#                     "question_number": 1,
#                     "type": prob.type,  # 1:객, 2:주, 3:단
#                     "question": response["text"]["question"],
#                     "options": response["text"]["choices"],
#                     "answer": response["text"]["answer"]
#                 },
#             ],
#             "description": 'not yet',
#         }


#         return res
#     except Exception as e:
#         log('error', f'Failed to Prob Chain Inference: {str(e)}', AWS_ACCESS_KEY)
#         raise e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)