from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from model.chain import Chain
# from data.pdf2vec import Pdf2Vec
from typing import List
from utils.logger import log

app = FastAPI()

# Pydantic model for request body validation
class GenRequest(BaseModel):
    message: str
    db_path: str
    type: str  # "객관식", "주관식", "단답형"

# Pydantic model for request body validation
class ConvertRequest(BaseModel):
    file_paths: List[str]

@app.post("/generate")
def generate_prob(gen_request: GenRequest):
    chain = Chain(gen_request.db_path, gen_request.type)
    try:
        response = chain.inference(gen_request.message)
        log('info', f'Chain inference is successed.')
        return response
    except Exception as e:
        log('error', f'Failed to Chain Inference: {str(e)}')
        raise e

# API endpoint to convert PDF to vectors
# @app.post("/convert")
# def convert_pdf(convert_request: ConvertRequest):
#     converter = Pdf2Vec()
#     try:
#         db_url = converter.convert(convert_request.file_paths)
#         log('info', 'PDF converted to vectors successfully.')
#         return {"message": "PDF converted to vectors successfully.", "db_url": db_url}
#     except Exception as e:
#         log('error', f'Failed to Convert PDF to Vectors: {str(e)}')
#         raise e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)