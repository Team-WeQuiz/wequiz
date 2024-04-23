import boto3
from urllib.parse import urlparse
from minio import Minio
from langchain_community.document_loaders.blob_loaders import Blob
from data.settings import PORT
from utils.hash import string_to_hash


class S3Loader:
    def __init__(self, access_credential, bucket_name):
        self.client = boto3.client(
            's3',
            aws_access_key_id=access_credential["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=access_credential["AWS_SECRET_ACCESS_KEY"]
        )
        self.bucket_name = bucket_name

    def load_file(self, key):        
        # 파일 로드
        try:
            file_obj = self.client.get_object(Bucket=self.bucket_name, Key=key)
            return Blob.from_data(file_obj.read())
        except Exception as e:
            print(f"Error loading file from S3: {e}")
            return None


#############################################################################################


class MinioLoader:
    def __init__(self, access_credential, bucket_name):
        self.bucket_name = bucket_name
        self.client = Minio(f'{urlparse(access_credential["url"]).netloc.split(":")[0]}:{PORT}',
            access_key=access_credential["accessKey"],
            secret_key=access_credential["secretKey"],
            secure=False
        )
        if self.client.bucket_exists(self.bucket_name):
            print(f"Bucket {self.bucket_name} exists")
        else:
            print(f"Bucket {self.bucket_name} does not exist")
    
    # bucket내 유저 폴더 안에 존재하는 파일 리스트 리턴
    def get_list(self, user_id, timestamp, type):
        try:
            prefix = string_to_hash(str(user_id) + str(timestamp))
            objects = self.client.list_objects(self.bucket_name, prefix=f'{prefix}/{type}', recursive=True)
            file_list = [obj.object_name for obj in objects if obj.object_name != user_id]
            if len(file_list) == 0:
                raise Exception(f'There is no file in Minio: {prefix}/{type}')
            else:
                return file_list
        except Exception as e:
            print(f"Error getting file list from Minio: {e}")
            return None

    # 파일 객체 읽기
    def load_file(self, key):        
        # 파일 로드
        try:
            file_obj = self.client.get_object(self.bucket_name, key)
            return Blob.from_data(file_obj.read())
        except Exception as e:
            print(f"Error loading file from Minio: {e}")
            return None