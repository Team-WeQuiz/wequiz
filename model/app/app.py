from msilib.schema import Error
from fastapi import FastAPI, HTTPException
import json
import aioboto3
from botocore.config import Config
import uuid
import asyncio
import os

from schema import *
from data.preprocessor import Parser, TextSplitter
from data.generator import QuizGenerator, Marker, Summarizer
from data.keyword import *
from utils.security import get_openai_api_key, get_aws_access_key
from utils.logger import *
from utils.exception import *
from data.settings import *
from data.tokenizer import *
# 로깅 설정
setup_logging()

app = FastAPI()

app.add_exception_handler(QuizGenerationException, quiz_generation_exception_handler)
app.add_exception_handler(NotAvailableFileException, not_available_file_exception_handler)
app.add_exception_handler(InsufficientTokensException, insufficient_tokens_exception_handler)
app.add_exception_handler(TooManyTokensException, too_many_tokens_exception_handler)
app.add_exception_handler(TooManyPagesException, too_many_pages_exception_handler)

server_num = os.environ["ML_SERVER_NUM"]
if server_num:
    os.environ["OPENAI_API_KEY"] = json.loads(get_openai_api_key(int(server_num)))["OPENAI_API_KEY"]
else:
    raise Error("What Server number is?")
aws_credentials = json.loads(get_aws_access_key())
os.environ["AWS_ACCESS_KEY_ID"] = aws_credentials["AWS_ACCESS_KEY_ID"]
os.environ["AWS_SECRET_ACCESS_KEY"] = aws_credentials["AWS_SECRET_ACCESS_KEY"]

## DynamoDB
REGION_NAME = 'ap-northeast-2'
QUIZ_TABLE = 'wequiz-quiz'
MARK_TABLE = 'wequiz-mark'
config = Config(parameter_validation=True)
# 객체 풀 생성
mecab_pool = MecabPool(size=3)
okt_pool = OktPool(size=3)


@app.get("/ping")
def ping():
    return {"ping": "pong"}


@app.post("/mark")
async def mark(mark_request: MarkRequest):
    marker = Marker()
    answers = []

    try:
        # 채점 및 답변 리스트 생성
        for answer in mark_request.submit_answers:
            marking = await marker.mark(mark_request.correct_answer, answer.user_answer, mark_request.quiz_type)
            data = {
                "user_id": answer.user_id,
                "user_answer": answer.user_answer,
                "marking": marking
            }
            answers.append(data)
    except Exception as e:
        log('error', f'[app.py > mark] Failed to Mark answer: {str(e)}')
        raise e

    # DynamoDB에 채점 결과 업데이트
    marked_item = {
        "id": {"S": str(mark_request.quiz_id)},
        "quiz_num": {"N": str(mark_request.quiz_num)},
        "correct_answer": {"S": mark_request.correct_answer},
        "markeds": {"L": [{"M": {
            "user_id": {"N": str(answer['user_id'])},
            "user_answer": {"S": answer['user_answer']},
            "marking": {"BOOL": answer['marking']}
        }} for answer in answers]}
    }

    try:
        async with aioboto3.Session().client('dynamodb', region_name=REGION_NAME, config=config) as dynamodb:
            try:
                # mark_request.id가 있는지 확인
                table = await dynamodb.get_item(
                    TableName=MARK_TABLE,
                    Key={'id': {'S': str(mark_request.id)}, 'timestamp': {'S': mark_request.timestamp}}
                )

                # mark_request.id가 테이블에 없는 경우
                if 'Item' not in table:
                    # 새로운 아이템 추가
                    await dynamodb.put_item(
                        TableName=MARK_TABLE,
                        Item={"id": {"S": str(mark_request.id)}, 'timestamp': {'S': mark_request.timestamp}, "answers": {"L": [{"M": marked_item}]}}
                    )
                else:
                    # 이미 존재하는 아이템 업데이트
                    await dynamodb.update_item(
                        TableName=MARK_TABLE,
                        Key={'id': {'S': str(mark_request.id)}, 'timestamp': {'S': mark_request.timestamp}},
                        UpdateExpression="SET #answers = list_append(#answers, :new_answer)",
                        ExpressionAttributeNames={"#answers": "answers"},
                        ExpressionAttributeValues={":new_answer": {"L": [{"M": marked_item}]}}
                    )
            except Exception as e:
                log('error', f'[app.py > mark] Error occurred while validating credentials: {str(e)}')
                raise HTTPException(status_code=500, detail="Error occurred while validating credentials.")
    except Exception as e:
        log('error', f'[app.py > mark] Failed to push marked result to dynamodb: {str(e)}')
        raise e

    # 응답 반환
    res = {
        "id": mark_request.id,
        "quiz_id": mark_request.quiz_id,
        "marked_answers": answers
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
            "description": {"S": ''},
            "num_of_quiz": {"N": str(generate_request.num_of_quiz)}
        }
        
        async with aioboto3.Session().client('dynamodb', region_name=REGION_NAME, config=config) as dynamodb:
            try:
                await dynamodb.put_item(TableName=QUIZ_TABLE, Item=data)
            except aioboto3.exceptions.NoCredentialsError:
                log('error', '[app.py > create_id] No valid credentials found.')
                raise HTTPException(status_code=500, detail="No valid credentials found.")
            except Exception as e:
                log('error', f'[app.py > create_id] Error occurred while validating credentials: {str(e)}')
        
        res = {"id": id}
        log('info', f'[app.py > quiz] Create Empty Quiz Object: {res}')
        return res
    except Exception as e:
        log('error', f'[app.py > quiz] Failed to Generate Quiz: {str(e)}')
        raise e



async def generate_quiz_async(generate_request, id, summary_split_docs, vector_split_docs, keywords):
    try:
        # Generate description
        summary_docs = []
        async for doc in summary_split_docs:
            summary_docs.append(doc)
        summarizer = Summarizer()
        summary = await summarizer.summarize(summary_docs)
        
        async with aioboto3.Session().client('dynamodb', region_name=REGION_NAME, config=config) as dynamodb:
            try:
                await dynamodb.update_item(
                    TableName=QUIZ_TABLE,
                    Key={'id': {"S": id}},
                    UpdateExpression='SET description = :val, version = if_not_exists(version, :zero)',
                    ExpressionAttributeValues={':val': {'S': summary}, ':zero': {'N': '0'}}
                )

                vector_docs = []
                async for doc in vector_split_docs:
                    vector_docs.append(doc) 
                # Generate quiz
                quiz_generator = QuizGenerator(vector_docs, summary)

                async def generate_question(idx, i):
                    max_attempts = generate_request.num_of_quiz
                    for _ in range(max_attempts):
                        try:
                            keyword = keywords[i % len(keywords)]
                            question = await quiz_generator.generate_async(keyword, idx + 1)
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
                            log('info', f'[app.py > quiz] new quiz is ready. {new_question}')
                            return new_question, i + 1
                        except Exception as e:
                            log('warning', f'[app.py > quiz] Failed to Generate Quiz: {str(e)}')
                            i += 1
                    raise Exception(f"Failed to generate question after {max_attempts} attempts")

                questions = []
                idx = 0
                i = 0
                while idx < generate_request.num_of_quiz:
                    question, i = await generate_question(idx, i)
                    questions.append(question)
                    idx += 1

                    # 5문제가 생성되었거나 마지막 문제인 경우 DynamoDB에 업데이트
                    if idx % 5 == 0 or idx == generate_request.num_of_quiz:
                        log('info', f'[app.py > quiz] cur idx: {idx} - quiz batch is ready to push. idx: {idx}')

                        retries = 0
                        while retries < QUIZ_UPDATE_RETRY:
                            try:
                                response = await dynamodb.get_item(
                                    TableName=QUIZ_TABLE,
                                    Key={'id': {'S': id}}
                                )
                                item = response.get('Item', {})
                                existing_questions = item.get('questions', {'L': []})['L']
                                version = int(item.get('version', {'N': '0'})['N'])
                                updated_questions = existing_questions + questions
                                
                                # Update item in DynamoDB with optimistic locking
                                await dynamodb.update_item(
                                    TableName=QUIZ_TABLE,
                                    Key={'id': {"S": id}},
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
                                break
                            except Exception as e:
                                log('warning', "[app.py > quiz] Failed to push questions to dynamo due to version conflict. Retrying...")
                                retries += 1
                                
                        if retries == QUIZ_UPDATE_RETRY:
                            log('error', "[app.py > quiz] Failed to push questions to dynamo after maximum retries.")
                            raise Exception("Failed to push questions to dynamo after maximum retries.")

            except Exception as e:
                log('error', f'[app.py > quiz] Error occurred while updating quiz to dynamodb: {str(e)}')

    except Exception as e:
        log('error', f'[app.py > quiz] Failed to generate quiz: {str(e)}')
        raise e


@app.post("/generate")
async def generate(generate_request: GenerateRequest):
    try:
        # Parsing and split file
        parser = Parser()
        total_text = await parser.parse(generate_request.user_id, generate_request.timestamp)
        
        okt = okt_pool.get_okt()
        textsplitter = TextSplitter(tokenizer=okt)
        sentences = await textsplitter.split_sentences_async(total_text)
        # 각각의 작업을 비동기로 처리
        keyword_docs = textsplitter.split_docs_generator(sentences, KEYWORD_CHUNK_SIZE, KEYWORD_SENTENCE_OVERLAP)
        summary_docs = textsplitter.split_docs_generator(sentences, SUMMARY_CHUNK_SIZE, SUMMARY_SENTENCE_OVERLAP)
        vector_docs = textsplitter.split_docs_generator(sentences, VECTOR_CHUNK_SIZE, VECTOR_SENTENCE_OVERLAP)
        okt_pool.return_okt(okt)
        log('warning', keyword_docs)

        # create_id 실행
        res = await create_id(generate_request)

        # keyword 추출
        mecab = mecab_pool.get_mecab()
        keywords = await extract_keywords(mecab, keyword_docs, top_n=min(generate_request.num_of_quiz * 2, len(sentences) - 1))  # 키워드는 개수를 여유롭게 생성합니다.
        mecab_pool.return_mecab(mecab)
        log('info', f'[app.py > quiz] Extracted Keywords for creating {generate_request.num_of_quiz} quizs.: {keywords}')

        # quiz 생성 (비동기)
        asyncio.create_task(generate_quiz_async(generate_request, res["id"], summary_docs, vector_docs, keywords))

        return res
    
    except InsufficientTokensException as e:
        log('error', str(e))
        raise e
    except TooManyTokensException as e:
        log('error', str(e))
        raise e
    except TooManyPagesException as e:
        log('error', str(e))
        raise e
    except InsufficientException as e:
        log('error', str(e))
        raise NotAvailableFileException(f"Cannot create some quiz due to insufficient data: {str(e)}") from e
    except Exception as e:
        log('error', f'[app.py > quiz] Unexpected error occurred: {str(e)}')
        raise QuizGenerationException(f"Quiz generation failed due to an unexpected error: {str(e)}") from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7999)