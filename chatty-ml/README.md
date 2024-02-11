# Chatty ML Server

## Overview
챗봇 생성

## Architecture

<img src="./assets/ML_architecture.png">

## Skills
- Langchain
- FastAPI

## Usage
가상 환경 activate
```
source ./.env/bin/activate
```

필요한 패키지 다운로드
```
pip install -r requirements.txt
```

app 폴더로 이동
```
cd app
```

API 앱 실행
```
export OPENAI_API_KEY=your_openai_api_key_here
uvicorn app:app --reload
```

챗봇 클라이언트 실행
```
python3 main.py
```
---
## API test (local)
### Convert PDF to Vector
**request** 

```
# post
http://127.0.0.1:8000/convert
```

```json
{
    "file_path": "data/dummyData/초거대 언어모델 연구 동향.pdf"
}
```

**response**

```json
{
    "message": "PDF converted to vectors successfully.",
    "db_url": "data/faiss_index2"
}
```
### Inference Request

**request** 

```
# post
http://127.0.0.1:8000/ask
```

```json
{
    "message": "LLM의 등장으로 변화한 점 알려줘"
}
```

**response**

```json
{
    "response": "LLM의 등장으로 변화한 점은 다음과 같습니다:\n\n1. 다양한 태스크 수행 가능: LLM은 번역, 요약, 질의응답, 형태소분석 등 다양한 태스크를 하나의 모델로 수행할 수 있게 되었습니다. ..."
}
```