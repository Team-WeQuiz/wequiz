package com.chatty.chatty.quizroom.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum FileExceptionType implements ExceptionType {

    FILE_INPUT_STREAM_FAILED(Status.BAD_REQUEST, 7001, "파일 입력 스트림 생성에 실패했습니다"),
    FAILED_TO_ENCRYPT(Status.SERVER_ERROR, 7002, "암호화에 실패했습니다");

    private final Status status;
    private final int exceptionCode;
    private final String message;

    FileExceptionType(Status status, int exceptionCode, String message) {
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
