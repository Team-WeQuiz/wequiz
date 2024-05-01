from fastapi import FastAPI
import json, random
import boto3
import uuid
import asyncio
import os

from schema import *
from data.preprocessor import Parser
from data.generator import QuizGenerator, Marker, Summarizer
from utils.security import get_openai_api_key, get_aws_access_key
from utils.logger import log

app = FastAPI()

os.environ["OPENAI_API_KEY"] = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
AWS_ACCESS_KEY = json.loads(get_aws_access_key())

## DynamoDB
REGION_NAME = 'ap-northeast-2'
QUIZ_TABLE = 'wequiz-quiz'
MARK_TABLE = 'wequiz-mark'
dynamodb = boto3.client('dynamodb', region_name=REGION_NAME)


@app.get("/ping")
def ping():
    return {"ping": "pong"}


@app.post("/mark")
def mark(mark_request: MarkRequest):
    marker = Marker()
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
        log('error', f'Failed to Mark answer: {str(e)}')
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
        log('error', f'Failed to push marked result to dynamodb: {str(e)}')
        raise e

    # 응답 반환
    res = {
        "id": mark_request.id,
        "quiz_id": mark_request.quiz_id,
        "answers": answers
    }
    print(f'Marking is generated: {res}')
    return res


def create_id(generate_request, id):
    try: 
        # Prepare data for DynamoDB insertion
        data = {
            "id": {"S": id},
            "timestamp": {"S": generate_request.timestamp},
            "user_id": {"N": str(generate_request.user_id)},
            "questions": {"L": []},
            "description": {"S": ''}
        }

        # Insert data into DynamoDB
        dynamodb.put_item(TableName=QUIZ_TABLE, Item=data)

        res = {"id": id}
        print(f'Create Empty Quiz Object: {res}')
        return res

    except Exception as e:
        log('error', f'Failed to Generate Quiz: {str(e)}')
        raise e



async def generate_quiz_async(generate_request, id, split_docs):
    try:
        # Generate description
        summarizer = Summarizer()
        summary, inters = await summarizer.summarize(split_docs)

        dynamodb.update_item(
            TableName=QUIZ_TABLE,
            Key={'id': {"S": id}, 'timestamp': {'S': generate_request.timestamp}},
            UpdateExpression='SET description = :val',
            ExpressionAttributeValues={':val': {'S': summary}}
        )

    except Exception as e:
        log('error', f'Failed to Generate Description: {str(e)}')
        raise e

    # Generate quiz
    quiz_generator = QuizGenerator(split_docs)
    if len(inters) <= generate_request.numOfQuiz:
        inters = inters * ((generate_request.numOfQuiz // len(inters)) + 1)
    contents = inters[:generate_request.numOfQuiz]

    if len(contents) != generate_request.numOfQuiz:
        raise Exception('키워드가 충분히 생성되지 않았습니다.')

    for idx, keyword in enumerate(contents):
        response = dynamodb.get_item(
            TableName=QUIZ_TABLE,
            Key={'id': {'S': id}, 'timestamp': {'S': generate_request.timestamp}}
        )
        item = response.get('Item', {})
        questions = item.get('questions', {'L': []})['L']

        # Randomly select type (0: multiple choice, 1: short answer, 2: OX quiz)
        type = random.randrange(0, 2)

        # Generate a new question
        question = quiz_generator.generate(type, keyword, idx + 1)
        new_question = {
            "M": {
                "id": {"S": str(question["id"])},
                "question_number": {"N": str(question["question_number"])},
                "type": {"S": question["type"]},
                "question": {"S": question["question"]},
                "options": {"L": [{"S": option} for option in question["options"]]},
                "correct": {"S": question["correct"]}
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

@app.post("/generate")
async def generate(generate_request: GenerateRequest):
    id = f'quizset-{uuid.uuid4()}'
    # Parsing and split file
    parser = Parser(generate_request.user_id, generate_request.timestamp)
    split_docs = parser.parse()

    try:
        res = create_id(generate_request, id)
        quiz_task = asyncio.create_task(generate_quiz_async(generate_request, id, split_docs))
        
        return res

    except Exception as e:
        log('error', f'Failed to Generate Quiz: {str(e)}')
        raise e



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7999)