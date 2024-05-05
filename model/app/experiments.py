import json
from utils.security import get_openai_api_key
from langchain_openai import ChatOpenAI


OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-3.5-turbo-0125")

text = """
Retrieval Augmented Generation LLM의 파라미터는 일종의 내부 메모리 모듈의 역할을 수행하는데, 특정 한 태스크의 해결을 위해서는 context 내에 명시되지 않은 정보를 내재적으로 갖춰야 하는 경우가 많고, 그 결과로 파라미터의 수가 증가하게 된다. 그러나, 만약 LLM이 외부의 지식 또는 정보에 효과적으로 접근하 며 그 정보를 활용할 수 있다면, 모든 지식을 내부 메 모리에 저장하는 대신, 필요한 정보를 외부에서 추출 하여 사용하는 방식으로 파라미터 수를 줄일 수 있을 것이다. 이러한 관점에서 볼 때,검색 엔진과 같은 도 구를 외부 메모리 모듈로 활용하는 LLM은 특정 쿼리 와 관련된 정보를 빠르게 색인하고 추출하여 사실 기 반의 답변 제공 및 최신 정보를 반영이 가능하며, 불 필요한 지식의 저장을 최소화함으로써, 모델의 파라 미터 수를 획기적으로 줄일 수 있다. 이러한 방법론을
"""

# I'll tip you if you make a quality exam question.


prompt = f"""
Make exam question related to the CONTEXT below.
You Just make only one exam question in the form of one of the below types list.
types = ['Multiple choice', 'Short answer type that can be easily answered in one word', 'yes/no quiz']
If it's not real exam quality, my life is in danger. 
Be sure to write in Korean.

CONTEXT: {text}

QUESTION:
CORRECT ANSWER:
"""


response = llm.invoke(prompt)
question = response.content


prompt2= f'''
Convert the below exam question to match the OUTPUT format.
If you don't match the format correctly, I'm in danger.
Be sure to write in Korean.

EXAM QUESTION:
{question}

The output should be formatted as a JSON instance that conforms to the JSON schema.
                                                                                                                                                                                                                                                                                                                             
Here is the output schema:
{{
    "properties": {{
        "question": {{
            "title": "Question",
            "description": "question about keywords",
            "type": "string"
            }},
        "choices": {{
            "title": "Choices",
            "default": [], 
            "type": "array",
            "items": {{
                "type": "string"
                }}
            }},
        "correct": {{
            "title": "Correct",
            "description": "The correct answer",
            "type": "string"
        }}
        }}, 
        "required": [
            "question",
            "correct"
            ]
}}
YOUR ANSWER:'''

print(prompt2)
response2 = llm.invoke(prompt2)
print(response2.content)