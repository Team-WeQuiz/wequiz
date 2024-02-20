from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from model.chain import Chain
from data.pdf2vec import Pdf2Vec
from typing import List
from utils.logger import log

app = FastAPI()
chain = Chain()
converter = Pdf2Vec()

# Pydantic model for request body validation
class AskRequest(BaseModel):
    message: str

# Pydantic model for request body validation
class ConvertRequest(BaseModel):
    file_paths: List[str]

@app.post("/ask")
def chain_inference(ask_request: AskRequest):
    try:
        response = chain.inference(ask_request.message)
        log('info', 'Chain inference is successed.')
        return {"response": response}
    except Exception as e:
        log('error', f'Failed to Chain Inference: {str(e)}')
        raise e

# API endpoint to convert PDF to vectors
@app.post("/convert")
def convert_pdf(convert_request: ConvertRequest):
    try:
        db_url = converter.convert(convert_request.file_paths)
        log('info', 'PDF converted to vectors successfully.')
        return {"message": "PDF converted to vectors successfully.", "db_url": db_url}
    except Exception as e:
        log('error', f'Failed to Convert PDF to Vectors: {str(e)}')
        raise e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)