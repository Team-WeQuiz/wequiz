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
    openjdk-8-jdk

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

# Mecab 설치
RUN python3.10 -m pip install konlpy JPype1-py3
RUN bash -c mecab_install.sh
RUN python3.10 -m pip install mecab-python3

# Install AWS CLI
RUN python3.10 -m pip install awscli

# Set the working directory in the container
WORKDIR /app/app

# Expose the port that uvicorn will run on
EXPOSE 7999

# Command to run uvicorn with auto-reload
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7999", "--reload"]