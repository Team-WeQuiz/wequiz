CHOICE_PROB_TEMPLATE = """
You are the best kindly AI model creating questions for learning.

Please create a multiple choice question about keyword based on the document.
Be sure to answer in Korean.
keyword: {message}

{format_instructions}

YOUR ANSWER:"""

######################################################################
SHORT_PROB_TEMPLATE = """
You are the best kindly AI model creating questions for learning.

Please create a short answer question that people can answer as a word about keyword based on the document.
The correct answer is only a word.
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

Please summarize these into 3 lines or less by integrating them.
Please answer in Korean.

YOUR ANSWER:"""

######################################################################

MARK_TEMPLATE = """
Here is correct answer.
{answer}

Here is user's answer.
{user}

If the user answer is correct, return True or False.

YOUR ANSWER:"""
