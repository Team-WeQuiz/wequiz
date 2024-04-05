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


class GenerateRequest(BaseModel):
    id: int
    timestamp: str
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

    #### generate quiz ####
    prob_generator = ProbGenerator(split_docs, OPENAI_API_KEY)
    #### NotImplemented keyword part ####
    keywords = ["원핫인코딩", "의미기반 언어모델", "사전학습", "전처리", "미세조정"]
    if len(keywords) != generate_request.numOfQuiz:
        raise Exception('키워드가 충분히 생성되지 않았습니다.')
    questions = []
    #####################################
    for idx, keyword in enumerate(keywords):
        try:
            generated_prob = prob_generator.generate(generate_request.type, keyword, idx+1)
            questions.append(generated_prob)
        except Exception as e:
            log('error', f'Failed to Generate Quiz {idx}-{keyword}: {str(e)}', AWS_ACCESS_KEY)
            raise e

    # DynamoDB에 삽입할 데이터 구성
    data = {
        "id": {"N": str(generate_request.id)},  # id를 문자열로 변환하여 저장
        "timestamp": {"S": generate_request.timestamp},  # 변환하지 않고 그대로 사용
        "questions": {"L": [
            {
                "M": {
                    "id": {"S": str(question["id"])},
                    "question_number": {"N": str(question["question_number"])},
                    "type": {"S": question["type"]},
                    "question": {"S": question["question"]},
                    "options": {"L": [{"S": option} for option in question["options"]]},
                    "answer": {"S": question["answer"]}
                }
            } for question in questions  # Assuming `questions` is a list of question objects
        ]},
        "description": {"S": summary}
    }

    try:
        # DynamoDB에 데이터 삽입
        dynamodb.put_item(
            TableName=TABLE_NAME,
            Item=data
        )

        res = {
            "id": generate_request.id
        }

        yield res
    except Exception as e:
        log('error', f'Failed to push quiz to dynamodb: {str(e)}', AWS_ACCESS_KEY)
        raise e



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)