import os
import boto3
import logging
from botocore.exceptions import ClientError

def log(log_type, message, aws_access_key):
    bucket_name = 'wequiz-logs'
    file_path = 'model.log'
    aws_access_key_id=aws_access_key["AWS_ACCESS_KEY_ID"]
    aws_secret_access_key=aws_access_key["AWS_SECRET_ACCESS_KEY"]

    # Initialize S3 client
    s3_client = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

    # Check if the log file exists in S3
    try:
        s3_client.head_object(Bucket=bucket_name, Key=file_path)
    except ClientError as e:
        if e.response['Error']['Code'] == "404":
            print("The log file does not exist in the S3 bucket. Creating a new log file.")
            with open(file_path, 'w'):
                pass  # Create an empty file
            # Upload the new log file to S3
            try:
                s3_client.upload_file(file_path, bucket_name, file_path)
            except ClientError as e:
                print("Error occurred while uploading the new log file to S3:", e)
        else:
            print("Error occurred while checking the existence of the log file in S3:", e)
        return

    # Download the log file from S3
    try:
        s3_client.download_file(bucket_name, file_path, file_path)
    except ClientError as e:
        print("Error occurred while downloading the log file from S3:", e)
        return

    # Configure logging
    logging.basicConfig(filename=file_path, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    # Log the message with the specified type
    if log_type == 'debug':
        logging.debug(message)
    elif log_type == 'info':
        logging.info(message)
    elif log_type == 'warning':
        logging.warning(message)
    elif log_type == 'error':
        logging.error(message)
    elif log_type == 'critical':
        logging.critical(message)
    else:
        print("Invalid log type. Please use one of: debug, info, warning, error, critical")

    # Upload the updated log file to S3
    try:
        s3_client.upload_file(file_path, bucket_name, file_path)
    except ClientError as e:
        print("Error occurred while uploading the log file to S3:", e)