import gradio as gr
from chain import Chain

chain = Chain()

# gardio에 삽입할 함수
def answer(message, history):
    return chain.inference(message, history)

# 그라디오 챗봇 클라이언트
def set_client():
    client = gr.ChatInterface(
                answer,
                chatbot=gr.Chatbot(height=600),
                textbox=gr.Textbox(placeholder="Chatty에게 질문해주세요", container=False, scale=7),
                title="Chatty",
                description="맞춤형 AI 과외선생님 Chatty에게 질문하세요!",
                retry_btn=None,
                undo_btn=None,
                clear_btn=None,
            )
    return client

# 챗봇 실행
set_client().launch()
