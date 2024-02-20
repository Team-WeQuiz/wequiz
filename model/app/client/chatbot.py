import requests
import gradio as gr

class Chatbot():
    def __init__(self):
        self.client = self.set_client()

    # gardio에 삽입할 함수
    def answer(self, message, history):
        # POST request to the FastAPI endpoint
        response = requests.post("http://localhost:8000/ask", json={"message": message}).json()
        return response["response"]
        
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
        self.client.launch()