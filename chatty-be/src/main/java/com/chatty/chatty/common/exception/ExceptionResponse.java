package com.chatty.chatty.common.exception;

public record ExceptionResponse(
        int exceptionCode,
        String message
) {

}