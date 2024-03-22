package com.chatty.chatty.user.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionType;

public class UserException extends BaseException {

    public UserException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
