package com.chatty.chatty.quizroom.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum QuizRoomExceptionType implements ExceptionType {

    FAILED_TO_CREATE_QUIZ(Status.SERVER_ERROR, 3001, "ML 서버에서 퀴즈 생성에 실패했습니다"),
    ROOM_NOT_FOUND(Status.NOT_FOUND, 1002, "방 정보가 없습니다"),
    ROOM_STARTED(Status.BAD_REQUEST, 1003, "이미 시작된 방입니다"),
    ROOM_FINISHED(Status.BAD_REQUEST, 1004, "이미 종료된 방입니다"),
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
