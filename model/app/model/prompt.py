CHOICE_PROB_TEMPLATE = """
From the document, make a multiple choice type exam question related to the CONTENT below. I'll tip you if you make a quality exam question.

CONTENT:
{context}

{format_instructions}


Be sure to answer in Korean. 

YOUR ANSWER:"""

######################################################################
SHORT_PROB_TEMPLATE = """
From the document, make a short answer type exam question that people can answer in one word related to the CONTENT below. I'll tip you if you make a quality exam question.

CONTENT:
{context}

{format_instructions}


Be sure to answer in Korean. 

YOUR ANSWER:"""

######################################################################

MAP_TEMPLATE = """
Here are some of the documents:
{pages}

Please summarize the main points on this document.

YOUR ANSWER:"""

REDUCE_TEMPLATE = """
Here is a set of summaries:
{docs}

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
