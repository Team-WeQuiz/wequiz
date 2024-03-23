package com.chatty.chatty.quizroom.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum QuizRoomExceptionType implements ExceptionType {

    //퀴즈 생성 실패
    FAILED_TO_MAKE_QUIZ(Status.SERVER_ERROR, 3001, "ML 서버에서 퀴즈 생성에 실패했습니다"),
    ;

    private final Status status;
    private final int exceptionCode;
    private final String message;

    QuizRoomExceptionType(Status status, int exceptionCode, String message) {
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
