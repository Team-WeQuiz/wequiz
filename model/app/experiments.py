import json
from utils.security import get_openai_api_key
from langchain_openai import ChatOpenAI


OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-3.5-turbo-0125")

text = """

"""

prompt = f"""

CONTEXT: {text}

Please answer in Korean.
ANSWER: """


response = llm.invoke(prompt)
print(response)