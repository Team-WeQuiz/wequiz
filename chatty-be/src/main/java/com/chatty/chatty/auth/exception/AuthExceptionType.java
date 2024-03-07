package com.chatty.chatty.auth.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum AuthExceptionType implements ExceptionType {

    USER_NOT_FOUND(Status.UNAUTHORIZED, 1001, "존재하지 않는 사용자입니다"),
    INVALID_TOKEN(Status.BAD_REQUEST, 1002, "토큰이 유효하지 않습니다"),
    INVALID_PASSWORD(Status.UNAUTHORIZED, 1003, "비밀번호가 일치하지 않습니다"),
    UNAUTHORIZED(Status.UNAUTHORIZED, 1004, "로그인한 정보가 없습니다"),
    SIGNATURE_NOT_FOUND(Status.BAD_REQUEST, 1005, "서명을 확인하지 못했습니다"),
    MALFORMED_TOKEN(Status.BAD_REQUEST, 1006, "토큰 형식이 잘못되었습니다"),
    EXPIRED_TOKEN(Status.BAD_REQUEST, 1007, "이미 만료된 토큰입니다"),
    UNSUPPORTED_TOKEN(Status.BAD_REQUEST, 1008, "지원하지 않는 토큰입니다"),
    INVALID_SIGNATURE(Status.BAD_REQUEST, 1009, "잘못된 서명입니다"),
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
