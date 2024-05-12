# # preprocessor.py
BUCKET_NAME = 'wequiz-files'
PORT = 9010
PARSING_RETRY = 3
MIN_TOKEN_LIMIT = 1500

# keyword chunk
KEYWORD_CHUNK_SIZE = 500
KEYWORD_CHUNK_OVERLAP = 0

# summary chunk
SUMMARY_CHUNK_SIZE = 3000
SUMMARY_CHUNK_OVERLAP = 600

# vector chunk
VECTOR_CHUNK_SIZE = 300
VECTOR_CHUNK_OVERLAP = 30


# generator.py
QUIZ_GENERATE_RETRY = 3
QUIZ_LENGTH_MIN_LIMIT = 6
YES_LIST= ['yes', 'YES', 'yes!', 'YES!', 'y', 'o', 'O', '예', '네', '그렇다', '맞다', '옳음', '옳다', '맞음']