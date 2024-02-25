package com.chatty.chatty.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionResponse;
import com.chatty.chatty.common.exception.ExceptionStatus;
import com.chatty.chatty.common.exception.ExceptionType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleException(BaseException e) {
        log.warn(e.getMessage(), e);
        ExceptionType exceptionType = e.getExceptionType();
        ExceptionStatus exceptionStatus = ExceptionStatus.from(exceptionType.status());
        return ResponseEntity.status(exceptionStatus.getHttpStatus())
                .body(new ExceptionResponse(exceptionType.exceptionCode(), exceptionType.message()));
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionResponse> handleException(Exception e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ExceptionResponse(0000, e.getMessage()));
    }
}
