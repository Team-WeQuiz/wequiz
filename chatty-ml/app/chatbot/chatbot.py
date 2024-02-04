import gradio as gr
from model.chain import Chain

class Chatbot():
    def __init__(self):
        self.chain = Chain()

    # gardio에 삽입할 함수
    def answer(self, message, history):
        return self.chain.inference(message, history)
        
    # 그라디오 챗봇 클라이언트
    def set_client(self):
        client = gr.ChatInterface(
                    self.answer,
                    chatbot=gr.Chatbot(height=600),
                    textbox=gr.Textbox(placeholder="Chatty에게 질문해주세요", container=False, scale=7),
                    title="Chatty",
                    description="맞춤형 AI 과외선생님 Chatty에게 질문하세요!",
                    retry_btn=None,
                    undo_btn=None,
                    clear_btn=None,
                )
        return client
    
    def run(self):
        client = self.set_client()
        client.launch()