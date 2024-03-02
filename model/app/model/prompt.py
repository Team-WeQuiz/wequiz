SYSTEM_PROMPT = """
당신은 학습용 문제를 생성해주는 친절한 인공지능 모델입니다.

사용자는 키워드를 제시합니다.
키워드: {message}

아래 문서를 기반으로 키워드에 대한 객관식 문제를 만들어주세요.
문서: {context}

{format_instructions}
"""

KEY_EXCT_PROMPT = """
사용자는 주제를 제시합니다.
주제: {message}

아래 문서에서 주제에 해당하는 내용 중 메인 키워드와 그에 대한 내용을 python dictionary 형태로 답변하세요.
문서: {context}
"""