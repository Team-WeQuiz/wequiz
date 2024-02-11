from fastapi import FastAPI, HTTPException
from pydantic import BaseModel 
from model.chain import Chain
from data.pdf2vec import Pdf2Vec

app = FastAPI()
chain = Chain()
converter = Pdf2Vec()

# Pydantic model for request body validation
class AskRequest(BaseModel):
    message: str

# Pydantic model for request body validation
class ConvertRequest(BaseModel):
    file_path: str

@app.post("/ask")
def chain_inference(ask_request: AskRequest):
    try:
        response = chain.inference(ask_request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to perform chain inference.")

# API endpoint to convert PDF to vectors
@app.post("/convert")
def convert_pdf(convert_request: ConvertRequest):
    #  dummy = "app/data/dummyData/초거대 언어모델 연구 동향.pdf"
    try:
        db_url = converter.convert(convert_request.file_path)
        return {"message": "PDF converted to vectors successfully.", "db_url": db_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to convert PDF to vectors.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)