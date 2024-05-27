package com.chatty.chatty.game.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum ModelExceptionType implements ExceptionType {

    INSUFFICIENT_TOKENS(Status.BAD_REQUEST, 9001, "토큰이 적어서 요청을 처리할 수 없습니다"),
    TOO_MANY_TOKENS(Status.BAD_REQUEST, 9002, "토큰이 너무 많아서 요청을 처리할 수 없습니다"),
    TOO_MANY_PAGES(Status.BAD_REQUEST, 9003, "페이지가 너무 많아서 요청을 처리할 수 없습니다"),
    FILE_NOT_AVAILABLE(Status.BAD_REQUEST, 9004, "사용할 수 없는 파일입니다"),
    FAILED_TO_CREATE(Status.SERVER_ERROR, 9005, "서버에서 퀴즈를 생성하는데 실패했습니다");

    private final Status status;
    private final int exceptionCode;
    private final String message;

    ModelExceptionType(Status status, int exceptionCode, String message) {
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
