from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from model.chain import Chain
from data.splitter import Splitter
from data.vectorizer import Vectorizer
from typing import List
from utils.logger import log
import uuid


app = FastAPI()

# Pydantic model for request body validation
class ProbRequest(BaseModel):
    id: str
    message: str
    db_path: str
    type: str  # "객관식", "주관식", "단답형"

# class MetaRequest(BaseModel):
#     db_path: str

# Pydantic model for request body validation
class ConvertRequest(BaseModel):
    file_paths: List[str]

@app.post("/generate/prob")
def generate_prob(prob: ProbRequest):
    chain = Chain(prob.db_path, prob.type)
    try:
        response = chain.prob(prob.message)
        log('info', f'Prob Chain inference is successed.')
        data = {
            "id": prob.id,
            "questions": [
                {
                    "id": uuid.uuid4(),
                    "question_number": 1,
                    "type": 1,  # 1:객, 2:주, 3:단
                    "question": response["text"]["question"],
                    "options": response["text"]["choices"],
                    "answer": response["text"]["answer"]
                }
            ],
            "description": 'not yet',
        }
        return data
    except Exception as e:
        log('error', f'Failed to Prob Chain Inference: {str(e)}')
        raise e


# API endpoint to convert PDF to vectors
@app.post("/convert")
def convert_pdf(convert_request: ConvertRequest):
    splitter = Splitter(convert_request.file_paths)
    vectorizer = Vectorizer() 
    try:
        split_docs = splitter.split_docs()
        db_url = vectorizer.convert(split_docs)
        log('info', 'PDF converted to vectors successfully.')
        return {"message": "PDF converted to vectors successfully.", "db_url": db_url}
    except Exception as e:
        log('error', f'Failed to Convert PDF to Vectors: {str(e)}')
        raise e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)