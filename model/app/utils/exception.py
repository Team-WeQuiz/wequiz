from fastapi import Request
from fastapi.responses import JSONResponse

class QuizGenerationException(Exception):
    pass

async def quiz_generation_exception_handler(request: Request, exc: QuizGenerationException):
    return JSONResponse(
        status_code=500,
        content={"message": str(exc)},
    )

class InsufficientException(Exception):
    pass

class NotAvailableFileException(Exception):
    pass

async def not_available_file_exception_handler(request: Request, exc: NotAvailableFileException):
    return JSONResponse(
        status_code=400, # Bad Request
        content={"message": str(exc)},
    )

class InsufficientTokensException(Exception):
    pass

async def insufficient_tokens_exception_handler(request: Request, exc: InsufficientTokensException):
    return JSONResponse(
        status_code=422, # Unprocessable Entity
        content={"message": str(exc)},
    )

class TooManyTokensException(Exception):
    pass

async def too_many_tokens_exception_handler(request: Request, exc: TooManyTokensException):
    return JSONResponse(
        status_code=413,  # Payload Too Large
        content={"message": str(exc)},
    )

class TooManyPagesException(Exception):
    pass

async def too_many_pages_exception_handler(request: Request, exc: TooManyPagesException):
    return JSONResponse(
        status_code=416, # Range Not Satisfiable
        content={"message": str(exc)},
    )

class MinioException(Exception):
    pass

class ParsingException(Exception):
    pass
