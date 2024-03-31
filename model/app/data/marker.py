from model.chain import MarkChain

class Marker():
    def __init__(self, openai_api_key):
        self.openai_api_key = openai_api_key
        self.marker_chain = MarkChain(self.openai_api_key)
    
    def mark(self, answer, user):
        response = self.marker_chain.mark(answer, user)
        
        return 'true' in response['text'].lower()
