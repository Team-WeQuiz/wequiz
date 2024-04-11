import boto3

class S3Loader:
    def __init__(self, aws_access_key_id, aws_secret_access_key, bucket_name):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )
        self.bucket_name = bucket_name

    def load_file(self, key):        
        # 파일 로드
        try:
            file_obj = self.s3.get_object(Bucket=self.bucket_name, Key=key)
            return file_obj
        except Exception as e:
            print(f"Error loading file from S3: {e}")
            return None