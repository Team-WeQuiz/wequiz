package com.chatty.chatty.quizroom.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionType;

public class QuizRoomException extends BaseException {

    public QuizRoomException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
