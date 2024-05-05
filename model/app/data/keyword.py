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

    # 텍스트 데이터 합치기
    text_string = ' '.join(text_data)

    # 한글 불용어 읽기
    ko_stop_words = set([word.strip() for word in ko_stopwords.split('\n')])

    # 영어 불용어 읽기
    en_stop_words = set(en_stopwords.words('english'))

    # 토크나이징 및 불용어 제거
    tokens = word_tokenize(text_string)
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

    # TF-IDF 벡터라이저 생성
    vectorizer = TfidfVectorizer()

    # 전처리된 토큰 리스트에 TF-IDF 적용
    tfidf_matrix = vectorizer.fit_transform([' '.join(cleaned_tokens)])

    # 중요한 키워드 추출
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = tfidf_matrix.toarray()[0]
    top_scores = tfidf_scores.argsort()[-top_n:][::-1]
    keywords = [feature_names[i] for i in top_scores]

    return keywords