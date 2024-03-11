PROB_TEMPLATE = """
You are the best kindly AI model creating questions for learning.

Please create a multiple choice question about keyword based on the document.
Be sure to answer in Korean.
keyword: {message}

{format_instructions}

YOUR ANSWER:"""

######################################################################

MAP_TEMPLATE = """
Here are some of the documents:
{pages}

Please summarize the main points on this document.

YOUR ANSWER:"""

REDUCE_TEMPLATE = """
Here is a set of summaries:
{doc_summaries}

Please make an integrated summary based on these.
Be sure to answer in Korean.

YOUR ANSWER:"""
