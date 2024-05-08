from fastapi import FastAPI
import json, random
import time
import boto3
import aioboto3
import uuid
import asyncio
import os

from schema import *
from data.preprocessor import Parser
from data.generator import QuizGenerator, Marker, Summarizer
from data.keyword import *
from utils.security import get_openai_api_key, get_aws_access_key
from utils.logger import *
from utils.exception import *
# 로깅 설정
setup_logging()

app = FastAPI()

os.environ["OPENAI_API_KEY"] = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
AWS_ACCESS_KEY = json.loads(get_aws_access_key())

## DynamoDB
REGION_NAME = 'ap-northeast-2'
QUIZ_TABLE = 'wequiz-quiz'
MARK_TABLE = 'wequiz-mark'
dynamodb_client = aioboto3.client('dynamodb', region_name=REGION_NAME)


@app.get("/ping")
def ping():
    return {"ping": "pong"}


@app.post("/mark")
async def mark(mark_request: MarkRequest):
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
        log('error', f'[app.py > mark] Failed to Mark answer: {str(e)}')
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
        async with dynamodb_client as dynamodb:
            # mark_request.id가 있는지 확인
            table = await dynamodb.get_item(
                TableName=MARK_TABLE,
                Key={'id': {'S': str(mark_request.id)}}
            )

            # mark_request.id가 테이블에 없는 경우
            if 'Item' not in table:
                # 새로운 아이템 추가
                await dynamodb.put_item(
                    TableName=MARK_TABLE,
                    Item={"id": {"S": str(mark_request.id)}, "answers": {"L": [{"M": marked_item}]}}
                )
            else:
                # 이미 존재하는 아이템 업데이트
                await dynamodb.update_item(
                    TableName=MARK_TABLE,
                    Key={'id': {'S': str(mark_request.id)}},
                    UpdateExpression="SET #answers = list_append(#answers, :new_answer)",
                    ExpressionAttributeNames={"#answers": "answers"},
                    ExpressionAttributeValues={":new_answer": {"L": [{"M": marked_item}]}}
                )
    except Exception as e:
        log('error', f'[app.py > mark] Failed to push marked result to dynamodb: {str(e)}')
        raise e

    # 응답 반환
    res = {
        "id": mark_request.id,
        "quiz_id": mark_request.quiz_id,
        "answers": answers
    }
    log('info', f'[app.py > mark] Marking is generated: {res}')
    return res


async def create_id(generate_request):
    id = f'quizset-{uuid.uuid4()}'
    try: 
        # Prepare data for DynamoDB insertion
        data = {
            "id": {"S": id},
            "timestamp": {"S": generate_request.timestamp},
            "user_id": {"N": str(generate_request.user_id)},
            "questions": {"L": []},
            "description": {"S": ''}
        }
        
        async with dynamodb_client as dynamodb:
            await dynamodb.put_item(TableName=QUIZ_TABLE, Item=data)
        
        res = {"id": id}
        log('info', f'[app.py > quiz] Create Empty Quiz Object: {res}')
        return res
    except Exception as e:
        log('error', f'[app.py > quiz] Failed to Generate Quiz: {str(e)}')
        raise e



async def generate_quiz_async(generate_request, id, summary_split_docs, vector_split_docs, keywords):
    try:
        # Generate description
        summarizer = Summarizer()
        summary = await summarizer.summarize(summary_split_docs)
        
        async with dynamodb_client as dynamodb:
            await dynamodb.update_item(
                TableName=QUIZ_TABLE,
                Key={'id': {"S": id}, 'timestamp': {'S': generate_request.timestamp}},
                UpdateExpression='SET description = :val, version = if_not_exists(version, :zero)',
                ExpressionAttributeValues={':val': {'S': summary}, ':zero': {'N': '0'}}
            )
        
        # Generate quiz
        quiz_generator = QuizGenerator(vector_split_docs)

        idx = 0
        i = 0
        questions = []
        while idx < generate_request.numOfQuiz:
            max_attempts = generate_request.numOfQuiz  # 최대 시도 횟수
            success = False
            for _ in range(max_attempts):
                try:
                    keyword = keywords[i % len(keywords)]
                    question = quiz_generator.generate(keyword, idx + 1)
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
                    log('info', f'[app.py > quiz] new quiz is ready. {new_question}')
                    
                    idx += 1
                    i += 1
                    success = True
                    break  # 성공적으로 생성되면 반복문 종료
                except Exception as e:
                    log('warning', f'[app.py > quiz] Failed to Generate Quiz: {str(e)}')
                    i += 1
            if not success:
                log('error', "[app.py > quiz] Failed to generate question after {} attempts".format(max_attempts))
                raise Exception("Failed to generate question after {} attempts".format(max_attempts))
            
            # 5문제가 생성되었거나 마지막 문제인 경우 DynamoDB에 업데이트
            if idx % 5 == 0 or idx == generate_request.numOfQuiz:
                log('info', f'[app.py > quiz] cur idx: {idx} - quiz batch is ready to push. {questions}')
                response = await dynamodb.get_item(
                    TableName=QUIZ_TABLE,
                    Key={'id': {'S': id}, 'timestamp': {'S': generate_request.timestamp}}
                )
                item = response.get('Item', {})
                existing_questions = item.get('questions', {'L': []})['L']
                version = int(item.get('version', {'N': '0'})['N'])
                
                updated_questions = existing_questions + questions
                
                try:
                    # Update item in DynamoDB with optimistic locking
                    await dynamodb.update_item(
                        TableName=QUIZ_TABLE,
                        Key={'id': {"S": id}, 'timestamp': {'S': generate_request.timestamp}},
                        UpdateExpression='SET questions = :val, version = :new_version',
                        ConditionExpression='version = :current_version',
                        ExpressionAttributeValues={
                            ':val': {'L': updated_questions},
                            ':new_version': {'N': str(version + 1)},
                            ':current_version': {'N': str(version)}
                        }
                    )
                    log('info', f'[app.py > quiz] quiz push to dynamodb successed.')
                    questions = []  # 새로운 5문제를 위해 questions 리스트 초기화
                except dynamodb.exceptions.ConditionalCheckFailedException:
                    log('error', "[app.py > quiz] Failed to push questions to dynamo due to version conflict.")
                    raise Exception("Failed to push questions to dynamo due to version conflict.")

    except Exception as e:
        log('error', f'[app.py > quiz] Failed to generate quiz: {str(e)}')
        raise e


@app.post("/generate")
async def generate(generate_request: GenerateRequest):
    try:
        # Parsing and split file
        parser = Parser()
        
        # 비동기 작업 생성
        parse_task = asyncio.create_task(parser.parse(generate_request.user_id, generate_request.timestamp))
        create_id_task = asyncio.create_task(create_id(generate_request))

        # parse와 create_id를 병렬로 실행하고 결과 기다리기
        keyword_split_docs, summary_split_docs, vector_split_docs, res = await asyncio.gather(parse_task, create_id_task)

        # keyword 추출
        keywords = extract_keywords(keyword_split_docs, top_n=generate_request.numOfQuiz * 2)  # 키워드는 개수를 여유롭게 생성합니다.
        log('info', f'[app.py > quiz] Extracted Keywords: {keywords}')

        # quiz 생성 (비동기)
        asyncio.create_task(generate_quiz_async(generate_request, res["id"], summary_split_docs, vector_split_docs, keywords))

        return res

    except InsufficientException as e:
        log('error', str(e))
        raise QuizGenerationException(f"Quiz generation failed due to insufficient data: {str(e)}") from e

    except Exception as e:
        log('error', f'[app.py > quiz] Unexpected error occurred: {str(e)}')
        raise QuizGenerationException(f"Quiz generation failed due to an unexpected error: {str(e)}") from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7999)