from fastapi import FastAPI
import json, random
import boto3
import uuid

from schema import *
from data.splitter import Splitter
from data.prob_generator import ProbGenerator
from data.summarizer import Summarizer
from data.marker import Marker
from utils.logger import log
from utils.security import get_openai_api_key, get_aws_access_key

app = FastAPI()

### credential key
OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
AWS_ACCESS_KEY = json.loads(get_aws_access_key())

## DynamoDB
REGION_NAME = 'ap-northeast-2'
QUIZ_TABLE = 'wequiz-quiz'
MARK_TABLE = 'wequiz-mark'
dynamodb = boto3.client('dynamodb', region_name=REGION_NAME)

@app.get("/ping")
def ping():
    return {"ping": "pong"}

@app.post("/test")
def test(generate_request: GenerateRequest):
    # Parsing and split file
    splitter = Splitter(generate_request.files, AWS_ACCESS_KEY)
    split_docs = splitter.split_docs()

    with open('../log/pdf_parser/s3loader.txt', 'w') as f:
        f.write(split_docs)

    return split_docs


@app.post("/mark")
def mark(mark_request: MarkRequest):
    marker = Marker(OPENAI_API_KEY)
    answers = []

    try:
        # 채점 및 답변 리스트 생성
        for answer in mark_request.answers:
            marking = marker.mark(mark_request.correct, answer.user)
            data = {
                "user_id": answer.user_id,
                "user": answer.user,
                "marking": marking
            }
            answers.append(data)
    except Exception as e:
        log('error', f'Failed to Mark answer: {str(e)}', AWS_ACCESS_KEY)
        raise e

    # DynamoDB에 채점 결과 업데이트
    marked_item = {
        "id": {"S": str(mark_request.quiz_id)},
        "question_number": {"N": str(mark_request.question_number)},
        "correct": {"S": mark_request.correct},
        "markeds": {"L": [{"M": {
            "user_id": {"N": str(answer['user_id'])},
            "user": {"S": answer['user']},
            "marking": {"BOOL": answer['marking']}
        }} for answer in answers]}
    }

    try:
        # mark_request.id가 있는지 확인
        table = dynamodb.get_item(
            TableName=MARK_TABLE,
            Key={'id': {'S': str(mark_request.id)}}
        )

        # mark_request.id가 테이블에 없는 경우
        if 'Item' not in table:
            # 새로운 아이템 추가
            dynamodb.put_item(
                TableName=MARK_TABLE,
                Item={"id": {"S": str(mark_request.id)}, "answers": {"L": [{"M": marked_item}]}}
            )
        else:
            # 이미 존재하는 아이템 업데이트
            dynamodb.update_item(
                TableName=MARK_TABLE,
                Key={'id': {'S': str(mark_request.id)}},
                UpdateExpression="SET #answers = list_append(#answers, :new_answer)",
                ExpressionAttributeNames={"#answers": "answers"},
                ExpressionAttributeValues={":new_answer": {"L": [{"M": marked_item}]}}
            )
    except Exception as e:
        log('error', f'Failed to push marked result to dynamodb: {str(e)}', AWS_ACCESS_KEY)
        raise e

    # 응답 반환
    return {
        "id": mark_request.id,
        "quiz_id": mark_request.quiz_id,
        "answers": answers
    }

@app.post("/generate")
def generate(generate_request: GenerateRequest):
    id = f'quizset-{uuid.uuid4()}'
    try:
        # Parsing and split file
        splitter = Splitter(generate_request.files, AWS_ACCESS_KEY)
        split_docs = splitter.split_docs()

        # Generate description
        summarizer = Summarizer(OPENAI_API_KEY)
        summary = summarizer.summarize(split_docs)

        # Prepare data for DynamoDB insertion
        data = {
            "id": {"S": id},
            "timestamp": {"S": generate_request.timestamp},
            "user_id": {"N": str(generate_request.user_id)},
            "questions": {"L": []},
            "description": {"S": summary}
        }

        # Insert data into DynamoDB
        dynamodb.put_item(TableName=QUIZ_TABLE, Item=data)

        # Yield response
        yield {"id": id, "description": summary}

        # Generate quiz
        prob_generator = ProbGenerator(split_docs, OPENAI_API_KEY)
        keywords = ["원핫인코딩", "의미기반 언어모델", "사전학습", "전처리", "미세조정"]
        if len(keywords) != generate_request.numOfQuiz:
            raise Exception('키워드가 충분히 생성되지 않았습니다.')

        for idx, keyword in enumerate(keywords):
            response = dynamodb.get_item(
                TableName=QUIZ_TABLE,
                Key={'id': {'S': id}, 'timestamp': {'S': generate_request.timestamp}}
            )
            item = response.get('Item', {})
            questions = item.get('questions', {'L': []})['L']

            # Randomly select type (0: multiple choice, 1: short answer)
            type = random.randrange(0, 2)

            # Generate a new question
            question = prob_generator.generate(type, keyword, idx + 1)
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
            questions.append(new_question)

            # Update item in DynamoDB
            dynamodb.update_item(
                TableName=QUIZ_TABLE,
                Key={'id': {"S": id}, 'timestamp': {'S': generate_request.timestamp}},
                UpdateExpression='SET questions = :val',
                ExpressionAttributeValues={':val': {'L': questions}}
            )

    except Exception as e:
        log('error', f'Failed to Generate Quiz: {str(e)}', AWS_ACCESS_KEY)
        raise e




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7999)