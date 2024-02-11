import os, yaml
from fastapi import FastAPI
from pydantic import BaseModel 
from model.chain import Chain

app = FastAPI()
chain = Chain()

# Pydantic model for request body validation
class AskRequest(BaseModel):
    message: str

@app.post("/ask")
def chain_inference(ask_request: AskRequest):
    response = chain.inference(ask_request.message)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)