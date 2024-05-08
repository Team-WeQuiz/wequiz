package com.chatty.chatty.game.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum ModelExceptionType implements ExceptionType {

    //토큰이 적을때 오류
    LACK_OF_TOKEN(Status.BAD_REQUEST, 9001, "토큰이 적어서 요청을 처리할 수 없습니다");

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
