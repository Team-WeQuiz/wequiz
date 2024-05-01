package com.chatty.chatty.player.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum PlayerExceptionType implements ExceptionType {

    DUPLICATE_NICKNAME(Status.BAD_REQUEST, 4001, "현재 방에 이미 존재하는 닉네임입니다");

    private final Status status;
    private final int exceptionCode;
    private final String message;

    PlayerExceptionType(Status status, int exceptionCode, String message) {
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
