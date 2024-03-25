from fastapi import FastAPI
from pydantic import BaseModel 
from model.chain import Chain
from data.splitter import Splitter
from data.vectorizer import Vectorizer
from typing import List
from utils.logger import log
from utils.security import get_openai_api_key, get_aws_access_key
import uuid
import json

app = FastAPI()

# Pydantic model for request body validation
class ProbRequest(BaseModel):
    id: int
    message: str
    indices: object
    type: str  # "객관식", "주관식", "단답형"

# Pydantic model for request body validation
class ConvertRequest(BaseModel):
    files: List[str]

class GenerateRequest(BaseModel):
    id: int
    numOfQuiz: int
    type: str
    files: List[str]

### credential key
OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
AWS_ACCESS_KEY = json.loads(get_aws_access_key())


# @app.post("/generate/prob")
def generate_prob(prob: ProbRequest):
    chain = Chain(prob.indices, prob.type, OPENAI_API_KEY)
    try:
        response = chain.prob(prob.message)
        log('info', f'Prob Chain inference is successed.', AWS_ACCESS_KEY)
        data = {
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
        return data
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
    convert_res = convert_pdf(
        ConvertRequest(files=generate_request.files)
    )
    log('info', 'PDF converted to vectors successfully.', AWS_ACCESS_KEY)

    prob_res = generate_prob(
        ProbRequest(
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