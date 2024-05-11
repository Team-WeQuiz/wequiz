GENERATE_QUIZ_TEMPLATE = """
Make exam question related to the CONTEXT below.
You Just make only one exam question in the form of one of the below types list.
types = {types}
If it's not real exam quality, my life is in danger. 
Be sure to write in Korean.

CONTEXT: {context}

QUESTION_TYPE:
QUESTION:
CORRECT ANSWER:
"""
JSON_FORMAT_TEMPLATE = """
Convert the below exam question to match the OUTPUT format.
If you don't match the format correctly, I'm in danger.
Be sure to write in polite Korean.


EXAM QUESTION:
{raw_quiz}


{format_instructions}


YOUR ANSWER:"""
###########################################################
CHOICE_PROB_TEMPLATE = """
Make a multiple choice type exam question related to the CONTEXT below. I'll tip you if you make a quality exam question.

CONTEXT:
{context}

{format_instructions}


Be sure to answer in Korean. 

YOUR ANSWER:"""

######################################################################
SHORT_PROB_TEMPLATE = """
Make a short answer type exam question that people can answer in one word related to the CONTEXT below. I'll tip you if you make a quality exam question.

CONTEXT:
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

Please summarize these into 3 sentences by integrating them.
Please answer in polite Korean.

YOUR ANSWER:"""

######################################################################

MARK_TEMPLATE = """
Here is correct answer.
CORRECT ANSWER: '{answer}'

Here is user's answer.
USER ANSWER: '{user}'

If the user answer is correct, return True or False.
If the user answer is empty string, treat it as a wrong answer.
Please grade carefully. I'll give you a tip if you do. 

YOUR ANSWER:"""
