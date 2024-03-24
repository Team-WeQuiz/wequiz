import tiktoken
from langchain.text_splitter import RecursiveCharacterTextSplitter
from utils.logger import log
from langchain_community.document_loaders import S3FileLoader


class Splitter():
    def __init__(self, file_paths, aws_access_key):
        self.bucket_name = 'kyuyeon-test'
        self.file_paths = file_paths
        self.aws_access_key_id=aws_access_key["AWS_ACCESS_KEY_ID"]
        self.aws_secret_access_key=aws_access_key["AWS_SECRET_ACCESS_KEY"]


    def num_tokens_from_string(self, string: str, encoding_name: str) -> int:
        encoding = tiktoken.get_encoding(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens


    # split docs
    def split_docs(self):
        if len(self.file_paths) == 0:
            log('warning', 'List of File paths is Empty.')
        else:
            log('info', f'There are {len(self.file_paths)} Files.')
        docs = []
        for file_path in self.file_paths:
            s3_file = S3FileLoader(
                self.bucket_name, file_path, aws_access_key_id=self.aws_access_key_id, aws_secret_access_key=self.aws_secret_access_key
                )
            
            data = s3_file.load()
            print(f"{len(data)}개의 페이지를 가지고 있습니다.")
            print(f"페이지에 {len(data[0].page_content)}개의 단어를 가지고 있습니다.")
            print(f'예상되는 토큰 수 {self.num_tokens_from_string(data[0].page_content, "cl100k_base")}')

            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
            doc = text_splitter.split_documents(data)
            print(f"파일에 {len(doc)}개의 문서를 가지고 있습니다.")
            docs += doc

        print(f"총 {len(docs)}개의 문서가 준비되었습니다.")
        log('info', f'Total {len(docs)} Docs are ready.')
        return docs