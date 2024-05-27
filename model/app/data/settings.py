# # preprocessor.py
BUCKET_NAME = 'wequiz-files'
PORT = 9010
PARSING_RETRY = 3

MIN_TOKEN_LIMIT = 1500
MAX_TOKEN_LIMIT = 100_000 # 10만
MAX_PAGE_LIMIT = 100

MAX_CHUNK_LENGTH = 3000
MIN_SENTENCE_LENGTH = 3

# keyword chunk
KEYWORD_CHUNK_SIZE = 500
KEYWORD_SENTENCE_OVERLAP = 0
MIN_DETECT_LENGTH = 5

# summary chunk
SUMMARY_CHUNK_SIZE = 3000
SUMMARY_SENTENCE_OVERLAP = 2

# vector chunk
VECTOR_CHUNK_SIZE = 320
VECTOR_SENTENCE_OVERLAP = 0

K = 2

# generator.py
QUIZ_GENERATE_RETRY = 3
QUIZ_LENGTH_MIN_LIMIT = 6
YES_LIST= ['yes', 'YES', 'yes!', 'YES!', 'Yes', 'y', 'o', 'O', 'True', '예', '네', '그렇다', '맞다', '옳음', '옳다', '맞음']
NO_LIST = ['no', 'NO', 'no!', 'NO!', 'No', 'n', 'x', 'X', 'False', '아니요', '아니오', '그렇지않다', '그렇지 않다', '틀리다', '틀림', '아님', '아니다', '옳지않음', '옳지 않다', '옳지 않음']