from langchain_community.document_loaders.pdf import BasePDFLoader
from typing import Optional, Union, Dict
from langchain_community.document_loaders.parsers.pdf import (
    # AmazonTextractPDFParser,
    # DocumentIntelligenceParser,
    # PDFMinerParser,
    # PDFPlumberParser,
    # PyMuPDFParser,
    # PyPDFium2Parser,
    PyPDFParser,
)

class PyPDFLoader(BasePDFLoader):
    """Load PDF using pypdf into list of documents.

    Loader chunks by page and stores page numbers in metadata.
    """

    def __init__(
        self,
        file_path: str,
        password: Optional[Union[str, bytes]] = None,
        headers: Optional[Dict] = None,
        extract_images: bool = False,
    ) -> None:
        """Initialize with a file path."""
        super().__init__(file_path, headers=headers)
        self.parser = PyPDFParser(password=password, extract_images=extract_images)
