from model.chain import SummaryChain

class Summarizer():
    def __init__(self, openai_api_key):
        self.openai_api_key = openai_api_key
        self.summary_chain = SummaryChain(self.openai_api_key)
    
    def summarize(self, split_docs):
        response = self.summary_chain.summary(split_docs)
        return response["output_text"]