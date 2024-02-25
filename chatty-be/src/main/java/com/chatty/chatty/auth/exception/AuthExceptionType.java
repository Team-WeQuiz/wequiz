package com.chatty.chatty.auth.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum AuthExceptionType implements ExceptionType {

    USER_NOT_FOUND(Status.UNAUTHORIZED, 1001, "존재하지 않는 사용자입니다"),
    INVALID_TOKEN(Status.BAD_REQUEST, 1002, "토큰이 유효하지 않습니다"),
    INVALID_PASSWORD(Status.UNAUTHORIZED, 1003, "비밀번호가 일치하지 않습니다"),
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    AuthExceptionType(Status status, int exceptionCode, String message) {
        this.status = status;
        this.exceptionCode = exceptionCode;
        this.message = message;
    }

    @Override
    public Status status() {
        return status;
    }

    @Override
    public int exceptionCode() {
        return exceptionCode;
    }

    @Override
    public String message() {
        return message;
    }
}
