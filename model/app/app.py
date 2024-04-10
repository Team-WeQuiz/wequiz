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
import random

app = FastAPI()


class GenerateRequest(BaseModel):
    id: int
    timestamp: str
    user_id: int
    numOfQuiz: int
    type: str
    files: List[str]

class Answer(BaseModel):
    user_id: int # user_id
    correct: str # 답안
    user: str # 유저가 작성한 답안

class MarkRequest(BaseModel):
    id: int   # 퀴즈방 id
    quiz_id: str # quiz_id
    question_number: int # 퀴즈방 내에서의 quiz number
    answers: List[Answer]

### credential key
OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
AWS_ACCESS_KEY = json.loads(get_aws_access_key())

## DynamoDB
REGION_NAME = 'ap-northeast-2'
QUIZ_TABLE = 'wequiz-quiz'
MARK_TABLE = 'wequiz-mark'
dynamodb = boto3.client('dynamodb', region_name=REGION_NAME)


@app.post("/mark")
def mark(mark_request: MarkRequest):
    marker = Marker(OPENAI_API_KEY)

    # 채점
    answers = []
    for answer in mark_request.answers:
        try:
            marking = marker.mark(answer.correct, answer.user)
            data = {
                "user_id": answer.user_id,
                "correct": answer.correct,
                "user": answer.user,
                "marking": marking
            }
            answers.append(data)
        except Exception as e:
            log('error', f'Failed to Mark answer: {str(e)}', AWS_ACCESS_KEY)
            raise e
    response = {
        "id": mark_request.id,
        "quiz_id": mark_request.quiz_id,
        "answers": answers
    }

    yield response


    # mark_request.id가 있는지 확인
    table = dynamodb.get_item(
        TableName=MARK_TABLE,
        Key={
            'id': {'N': str(mark_request.id)}
        }
    )

    # mark_request.id가 테이블에 없는 경우
    if 'Item' not in table:
        # 새로운 아이템을 추가
        print(mark_request)
        dynamodb.put_item(
            TableName=MARK_TABLE,
            Item={
                "id": {"N": str(mark_request.id)},
                "answers": {"L": [{"M":
                    {
                        "id": {"S": str(mark_request.quiz_id)},
                        "question_number": {"N": str(mark_request.question_number)},
                        "markeds": {"L": [{"M": {
                            "user_id": {"N": str(answer['user_id'])},
                            "correct": {"S": answer['correct']},
                            "user": {"S": answer['user']},
                            "marking": {"BOOL": answer['marking']}
                        }} for answer in answers]}
                    }
                }]}
            }
        )
    else:
        # 이미 존재하는 아이템을 업데이트
        # markeds 리스트에 새로운 데이터 추가
        dynamodb.update_item(
            TableName=MARK_TABLE,
            Key={
                'id': {'N': str(mark_request.id)}
            },
            UpdateExpression="SET #answers = list_append(if_not_exists(#answers, :empty_list), :new_answer)",
            ExpressionAttributeNames={
                "#answers": "answers"
            },
            ExpressionAttributeValues={
                ":new_answer": [{
                    "id": {"S": str(mark_request.quiz_id)},
                    "question_number": {"N": str(mark_request.question_number)},
                    "markeds": {"L":[{"M":
                        {
                            "user_id": {"N": str(answer['user_id'])},
                            "correct": {"S": answer['correct']},
                            "user": {"S": answer['user']},
                            "marking": {"BOOL": answer['marking']}
                        } for answer in answers
                    }]}
                }],
                ":empty_list": []
            }
        )


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
    except Exception as e:
        log('error', f'Failed to Summarize PDF: {str(e)}', AWS_ACCESS_KEY)
        raise e
    
    # DynamoDB에 삽입할 데이터 구성
    data = {
        "id": {"N": str(generate_request.id)},  # id를 문자열로 변환하여 저장
        "timestamp": {"S": generate_request.timestamp},  # 변환하지 않고 그대로 사용
        "user_id": {"N": str(generate_request.user_id)},
        "questions": {"L": []},
        "description": {"S": summary}
    }

    try:
        # DynamoDB에 데이터 삽입
        dynamodb.put_item(
            TableName=QUIZ_TABLE,
            Item=data
        )

        res = {
            "id": generate_request.id,
            "description": summary
        }

        yield res
    except Exception as e:
        log('error', f'Failed to push summary to dynamodb: {str(e)}', AWS_ACCESS_KEY)
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
            # DynamoDB에서 아이템을 읽어옵니다.
            response = dynamodb.get_item(
                TableName=QUIZ_TABLE,
                Key={
                    'id': {'N': str(generate_request.id)},  # Partition key
                    'timestamp': {'S': generate_request.timestamp}  # Sort key
                }
            )
            # 읽어온 아이템에 새로운 질문을 추가합니다.
            item = response['Item']
            questions = item.get('questions', {'L': []})['L']  # 기존의 questions 리스트를 가져옵니다.

            # 객관식(0) or 단답형(1) 랜덤 선택
            type = random.randrange(0, 2)

            question = prob_generator.generate(type, keyword, idx+1)  # 새 문제를 생성합니다.
            new_question = {
                "M": {
                    "id": {"S": str(question["id"])},
                    "question_number": {"N": str(question["question_number"])},
                    "type": {"S": question["type"]},
                    "question": {"S": question["question"]},
                    "options": {"L": [{"S": option} for option in question["options"]]},
                    "answer": {"S": question["answer"]}
                }
            }
            questions.append(new_question)  # 기존의 문제리스트에 새 문제를 추가합니다.

            # 변경된 아이템을 DynamoDB에 다시 업데이트합니다.
            response = dynamodb.update_item(
                TableName=QUIZ_TABLE,
                Key={
                    'id': {'N': str(generate_request.id)},  # Partition key
                    'timestamp': {'S': generate_request.timestamp}  # Sort key
                },
                UpdateExpression='SET questions = :val',  # 업데이트할 표현식
                ExpressionAttributeValues={':val': {'L': questions}}  # 업데이트할 값
            )

        except Exception as e:
            log('error', f'Failed to Generate Quiz {idx}-{keyword}: {str(e)}', AWS_ACCESS_KEY)
            raise e



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)