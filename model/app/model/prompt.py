SYSTEM_PROMPT = """
You are the best kindly AI model creating questions for learning.

Please create a multiple choice question about keyword based on the document.
Be sure to answer in Korean.
keyword: {message}

{format_instructions}
"""

# KEY_EXCT_PROMPT = """
# 사용자는 주제를 제시합니다.
# 주제: {message}

# 아래 문서에서 주제에 해당하는 내용 중 메인 키워드와 그에 대한 내용을 python dictionary 형태로 답변하세요.
# 문서: {context}
# """