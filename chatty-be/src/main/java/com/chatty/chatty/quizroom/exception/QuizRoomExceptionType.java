package com.chatty.chatty.quizroom.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum QuizRoomExceptionType implements ExceptionType {

    FAILED_TO_CREATE_QUIZ(Status.SERVER_ERROR, 3001, "ML 서버에서 퀴즈 생성에 실패했습니다"),
    ROOM_NOT_FOUND(Status.NOT_FOUND, 1002, "방 정보가 없습니다"),
    ROOM_NOT_READY(Status.BAD_REQUEST, 1003, "방이 준비 상태가 아닙니다"),
    ROOM_NOT_STARTED(Status.BAD_REQUEST, 1004, "방이 시작 상태가 아닙니다"),
    ROOM_NOT_FINISHED(Status.BAD_REQUEST, 1005, "방이 종료 상태가 아닙니다"),
    NO_ROOM_FOUND_BY_CODE(Status.BAD_REQUEST, 1006, "코드에 해당하는 방이 없습니다"),
    CODE_INVALID(Status.BAD_REQUEST, 1007, "코드가 유효하지 않습니다"),
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
