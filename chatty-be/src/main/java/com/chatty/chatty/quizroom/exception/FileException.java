package com.chatty.chatty.quizroom.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionType;

public class FileException extends BaseException {

    public FileException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
