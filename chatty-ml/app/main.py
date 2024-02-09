import os
import yaml
from chatbot.chatbot import Chatbot

if __name__ == "__main__":
    # Get Config
    with open('config.yaml', 'r') as file:
        config = yaml.safe_load(file)
        
    # Open AI API Key
    os.environ["OPENAI_API_KEY"] = config.get("OPENAI_API_KEY")
    
    # 챗봇 실행
    chatbot = Chatbot()
    chatbot.run()
