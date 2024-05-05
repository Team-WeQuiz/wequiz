from fastapi import FastAPI
import json, random
import time
import boto3
import uuid
import asyncio
import os

from schema import *
from data.preprocessor import Parser
from data.generator import QuizGenerator, Marker, Summarizer
from data.keyword import *
from utils.security import get_openai_api_key, get_aws_access_key
from utils.logger import *
# 로깅 설정
setup_logging()

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


def create_id(generate_request):
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
        dynamodb.put_item(TableName=QUIZ_TABLE, Item=data)
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
        summary, inters = await summarizer.summarize(summary_split_docs)
        dynamodb.update_item(
            TableName=QUIZ_TABLE,
            Key={'id': {"S": id}, 'timestamp': {'S': generate_request.timestamp}},
            UpdateExpression='SET description = :val, version = if_not_exists(version, :zero)',
            ExpressionAttributeValues={':val': {'S': summary}, ':zero': {'N': '0'}}
        )
    except Exception as e:
        log('error', f'[app.py > quiz] Failed to Generate Description: {str(e)}')
        raise e

    # Generate quiz
    quiz_generator = QuizGenerator(vector_split_docs)

    idx = 0
    i = 0
    while idx < generate_request.numOfQuiz:
        response = dynamodb.get_item(
            TableName=QUIZ_TABLE,
            Key={'id': {'S': id}, 'timestamp': {'S': generate_request.timestamp}}
        )
        item = response.get('Item', {})
        questions = item.get('questions', {'L': []})['L']
        version = int(item.get('version', {'N': '0'})['N'])

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
                log('info', f'[app.py > quiz] new quiz is ready to push. {new_question}')

                # Update item in DynamoDB
                update_success = False
                update_attempts = 10
                for update_attempt in range(update_attempts):
                    try:
                        # Update item in DynamoDB with optimistic locking
                        dynamodb.update_item(
                            TableName=QUIZ_TABLE,
                            Key={'id': {"S": id}, 'timestamp': {'S': generate_request.timestamp}},
                            UpdateExpression='SET questions = :val, version = :new_version',
                            ConditionExpression='version = :current_version',
                            ExpressionAttributeValues={
                                ':val': {'L': questions},
                                ':new_version': {'N': str(version + 1)},
                                ':current_version': {'N': str(version)}
                            }
                        )
                        update_success = True
                        break
                    except dynamodb.exceptions.ConditionalCheckFailedException:
                        # 버전 충돌로 인해 업데이트 실패
                        log('warning', f'[app.py > quiz] Update failed due to version conflict. Retrying...')
                        backoff_time = 0.1 * (2 ** update_attempt)  # 지수 백오프 시간 계산
                        await asyncio.sleep(backoff_time)  # 비동기적으로 대기
                
                if update_success:
                    log('info', f'[app.py > quiz] quiz push to dynamodb successed.')
                    idx += 1
                    i += 1
                    success = True
                    break  # 성공적으로 생성되면 반복문 종료
                else:
                    log('error', "[app.py > quiz] Failed to push questions to dynamo {} attempts".format(update_attempts))
                    raise Exception("Failed to push questions to dynamo {} attempts".format(update_attempts))
            except:
                i += 1
        if not success:
            log('error', "[app.py > quiz] Failed to generate question after {} attempts".format(max_attempts))
            raise Exception("Failed to generate question after {} attempts".format(max_attempts))


@app.post("/generate")
async def generate(generate_request: GenerateRequest):
    # Parsing and split file
    parser = Parser()
    keyword_split_docs, summary_split_docs, vector_split_docs = parser.parse(generate_request.user_id, generate_request.timestamp)
    keywords = extract_keywords(keyword_split_docs, top_n=generate_request.numOfQuiz*2)  # 키워드는 개수를 여유롭게 생성합니다.
    
    if len(keywords) < generate_request.numOfQuiz:
        raise Exception('키워드가 충분히 생성되지 않았습니다.')
    else:
        log('info', f'[app.py > quiz] Extracted Keywords: {keywords}')

    try:
        res = create_id(generate_request)
        quiz_task = asyncio.create_task(generate_quiz_async(generate_request, res["id"], summary_split_docs, vector_split_docs, keywords))  
        return res
    except Exception as e:
        log('error', f'[app.py > quiz] Failed to Generate Quiz: {str(e)}')
        raise e



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7999)