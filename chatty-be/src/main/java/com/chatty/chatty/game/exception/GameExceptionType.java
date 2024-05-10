package com.chatty.chatty.game.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum GameExceptionType implements ExceptionType {

    THREAD_INTERRUPTED(Status.SERVER_ERROR, 8001, "폴링 중 스레드가 중단되었습니다"),
    FAILED_TO_FETCH_DESCRIPTION(Status.SERVER_ERROR, 8002, "10분간의 대기 후 Description을 가져오지 못했습니다"),
    FAILED_TO_FETCH_QUIZ(Status.SERVER_ERROR, 8003, "10분간의 대기 후 Quiz를 가져오지 못했습니다");

    private final Status status;
    private final int exceptionCode;
    private final String message;

    GameExceptionType(Status status, int exceptionCode, String message) {
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
