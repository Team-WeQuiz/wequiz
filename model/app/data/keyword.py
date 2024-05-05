import string
from langdetect import detect
from konlpy.tag import Mecab
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords as en_stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from data.korean_stopwords import *

def extract_keywords(split_doc_list, top_n):
    text_data = []
    for doc in split_doc_list:
        text_data.append(doc.page_content)

    cleaned_text_data = []
    for text in text_data:
        language = detect(text)
        
        if language == 'ko':
            # 한글 문서인 경우
            mecab = Mecab()
            tokens = mecab.morphs(text)
            ko_stop_words = set([word.strip() for word in ko_stopwords.split('\n')])
            cleaned_tokens = [token for token in tokens if token not in ko_stop_words]
        else:
            # 영어 문서인 경우
            tokens = word_tokenize(text)
            en_stop_words = set(en_stopwords.words('english'))
            cleaned_tokens = [token.lower() for token in tokens if token.isalnum() and token.lower() not in en_stop_words and token not in string.punctuation]

        cleaned_text_data.append(' '.join(cleaned_tokens))

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(cleaned_text_data)
    feature_names = vectorizer.get_feature_names_out()

    tfidf_scores = tfidf_matrix.sum(axis=0).A1
    top_scores = tfidf_scores.argsort()[-top_n:][::-1]
    keywords = [feature_names[i] for i in top_scores]

    return keywords