import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords as en_stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from data.korean_stopwords import *

def extract_keywords(split_doc_list, top_n):
    # 문서 리스트 읽기
    text_data = []
    for doc in split_doc_list:
        text_data.append(doc.page_content)

    # 한글, 영어 불용어 읽기
    ko_stop_words = set([word.strip() for word in ko_stopwords.split('\n')])
    en_stop_words = set(en_stopwords.words('english'))

    cleaned_text_data = []
    for text in text_data:
        # 토크나이징 및 불용어 제거
        tokens = word_tokenize(text)
        cleaned_tokens = []
        for token in tokens:
            if token.isalnum():
                if token.isascii():
                    # 영어 토큰인 경우
                    token = token.lower()
                    if token not in en_stop_words and token not in string.punctuation:
                        cleaned_tokens.append(token)
                else:
                    # 한글 토큰인 경우
                    if token not in ko_stop_words:
                        cleaned_tokens.append(token)

        cleaned_text_data.append(' '.join(cleaned_tokens))


    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(cleaned_text_data)
    feature_names = vectorizer.get_feature_names_out()

    tfidf_scores = tfidf_matrix.sum(axis=0).A1
    top_scores = tfidf_scores.argsort()[-top_n:][::-1]
    keywords = [feature_names[i] for i in top_scores]

    return keywords