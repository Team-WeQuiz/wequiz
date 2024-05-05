# Use the official Ubuntu image as a base
FROM ubuntu:22.04

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3.10-dev \
    python3-pip \
    g++ \
    curl \
    ffmpeg \
    libsm6 \
    libxext6 \
    git \
    openjdk-8-jdk \
    python3-dev \
    python3-pip \
    curl \
    automake

# for our nltk data folder
ENV NLTK_DATA /usr/share/nltk_data

# Install Python dependencies
COPY requirements.txt .
RUN python3.10 -m pip install --upgrade pip
RUN python3.10 -m pip install --no-cache-dir -r requirements.txt

# download punkt
RUN python3.10 -m nltk.downloader punkt -d /usr/share/nltk_data

# download stopwords
RUN python3.10 -m nltk.downloader stopwords -d /usr/share/nltk_data

# MeCab 설치
RUN curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh > mecab.sh \
    && sed -i 's/config.guess/config.guess --force/g' mecab.sh \
    && sed -i 's/config.sub/config.sub --force/g' mecab.sh \
    && bash mecab.sh

# Install AWS CLI
RUN python3.10 -m pip install awscli

# Set the working directory in the container
WORKDIR /app/app

# Expose the port that uvicorn will run on
EXPOSE 7999

# Command to run uvicorn with auto-reload
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7999", "--reload"]