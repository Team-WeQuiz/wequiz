import string
import asyncio
from langdetect import detect
from konlpy.tag import Mecab
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords as en_stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from data.korean_stopwords import *
from utils.exception import *
from data.settings import *

async def extract_keywords(split_doc_list, top_n):
    try:
        cleaned_text_data = []
        async for doc in split_doc_list:
            text = doc.page_content.strip()
            if len(text) > MIN_DETECT_LENGTH:
                language = detect(text)
            else:
                continue
            
            if language == 'ko':
                # 한글 문서인 경우
                mecab = Mecab()
                tokens = mecab.morphs(text)
                ko_stop_words = set([word.strip() for word in ko_stopwords.split('\n')])
                cleaned_tokens = [token for token in tokens if token not in ko_stop_words]
            else:
                # 영어 또는 기타 언어 문서인 경우
                tokens = word_tokenize(text)
                en_stop_words = set(en_stopwords.words('english'))
                cleaned_tokens = [token.lower() for token in tokens if token.isalnum() and token.lower() not in en_stop_words and token not in string.punctuation]

            cleaned_text = ' '.join(cleaned_tokens).strip()
            if cleaned_text:
                cleaned_text_data.append(cleaned_text)

        if len(cleaned_text_data) == 0:
            raise InsufficientException("No cleaned text data found for keyword extraction.")

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(cleaned_text_data)
        feature_names = vectorizer.get_feature_names_out()
        tfidf_scores = tfidf_matrix.sum(axis=0).A1

        if len(feature_names) < top_n:
            raise InsufficientException(f"Insufficient features for keyword extraction. Found {len(feature_names)}, required {top_n}.")
        
        top_scores = tfidf_scores.argsort()[-top_n:][::-1]
        keywords = [feature_names[i] for i in top_scores]

        return keywords
    
    except InsufficientException as e:
        raise e
    except Exception as e:
        raise Exception(f"An unexpected error occurred during keyword extraction: {str(e)}")