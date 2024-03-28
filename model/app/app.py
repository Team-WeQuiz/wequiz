from fastapi import FastAPI
from pydantic import BaseModel 
from model.chain import Chain
from data.splitter import Splitter
from data.vectorizer import Vectorizer
from typing import List
from utils.logger import log
from utils.security import get_openai_api_key, get_aws_access_key
import uuid
import datetime
import json
import boto3

app = FastAPI()

# Pydantic model for request body validation
class ProbRequest(BaseModel):
    timestamp: str
    id: int
    message: str
    indices: object
    type: str  # "객관식", "주관식", "단답형"

# Pydantic model for request body validation
class ConvertRequest(BaseModel):
    timestamp: str
    files: List[str]

class GenerateRequest(BaseModel):
    id: int
    numOfQuiz: int
    type: str
    files: List[str]

### credential key
OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
AWS_ACCESS_KEY = json.loads(get_aws_access_key())

## DynamoDB
REGION_NAME = 'ap-northeast-2'
TABLE_NAME = 'wequiz-quiz'
dynamodb = boto3.client('dynamodb', region_name=REGION_NAME)


# @app.post("/generate/prob")
def generate_prob(prob: ProbRequest):
    try:
        chain = Chain(prob.indices, prob.type, OPENAI_API_KEY)
        response = chain.prob(prob.message)
        log('info', f'Prob Chain inference is successed.', AWS_ACCESS_KEY)

        print(f'prob.timestamp: {prob.timestamp}')

        # DynamoDB에 삽입할 데이터 구성
        data = {
            "id": {"S": str(prob.id)},  # id를 문자열로 변환하여 저장
            "timestamp": {"S": prob.timestamp},  # 변환하지 않고 그대로 사용
            "day": {"N": str(datetime.datetime.strptime(prob.timestamp, "%Y-%m-%d %H:%M:%S").day)},
            "month": {"N": str(datetime.datetime.strptime(prob.timestamp, "%Y-%m-%d %H:%M:%S").month)},
            "year": {"N": str(datetime.datetime.strptime(prob.timestamp, "%Y-%m-%d %H:%M:%S").year)},
            "questions": {"L": [
                {
                    "M": {
                        "id": {"S": str(uuid.uuid4())},
                        "question_number": {"N": "1"},
                        "type": {"S": str(prob.type)}, 
                        "question": {"S": response["text"]["question"]},
                        "options": {"L": [{"S": option} for option in response["text"]["choices"]]},
                        "answer": {"S": response["text"]["answer"]}
                    }
                }
            ]},
            "description": {"S": 'not yet'}
        }

        # DynamoDB에 데이터 삽입
        dynamodb.put_item(
            TableName=TABLE_NAME,
            Item=data
        )

        res = {
            "id": prob.id,
            "questions":
            [
                {
                    "id": uuid.uuid4(),
                    "question_number": 1,
                    "type": prob.type,  # 1:객, 2:주, 3:단
                    "question": response["text"]["question"],
                    "options": response["text"]["choices"],
                    "answer": response["text"]["answer"]
                },
            ],
            "description": 'not yet',
        }


        return res
    except Exception as e:
        log('error', f'Failed to Prob Chain Inference: {str(e)}', AWS_ACCESS_KEY)
        raise e


# API endpoint to convert PDF to vectors
# @app.post("/convert")
def convert_pdf(convert_request: ConvertRequest):
    splitter = Splitter(convert_request.files, AWS_ACCESS_KEY)
    vectorizer = Vectorizer(OPENAI_API_KEY) 
    try:
        split_docs = splitter.split_docs()
        # db_url = vectorizer.convert(split_docs)
        indices = vectorizer.convert(split_docs)
        log('info', 'PDF converted to vectors successfully.', AWS_ACCESS_KEY)
        return indices
    except Exception as e:
        log('error', f'Failed to Convert PDF to Vectors: {str(e)}', AWS_ACCESS_KEY)
        raise e


# integration API
@app.post("/generate")
def generate(generate_request: GenerateRequest):
    # 현재 날짜 및 시간 정보 가져오기
    current_datetime = datetime.datetime.utcnow()

    convert_res = convert_pdf(
        ConvertRequest(timestamp=current_datetime.strftime("%Y-%m-%d %H:%M:%S"), files=generate_request.files)
    )
    log('info', 'PDF converted to vectors successfully.', AWS_ACCESS_KEY)

    prob_res = generate_prob(
        ProbRequest(
            timestamp=current_datetime.strftime("%Y-%m-%d %H:%M:%S"),
            id=generate_request.id,
            message='원핫인코딩',
            indices=convert_res,
            type=generate_request.type
        )
    )
    log('info', f'Prob Chain inference is successed.', AWS_ACCESS_KEY)

    return prob_res


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)