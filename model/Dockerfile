# Use the official Python image as a base
FROM python:3.9

# Set the working directory in the container
WORKDIR /

# Copy the current directory contents into the container at /app
COPY . /app

# Copy requirements.txt separately and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Install AWS CLI
RUN pip install awscli

# Set the working directory in the container
WORKDIR /app/app

# Expose the port that uvicorn will run on
EXPOSE 8000

# Command to run uvicorn with auto-reload
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]