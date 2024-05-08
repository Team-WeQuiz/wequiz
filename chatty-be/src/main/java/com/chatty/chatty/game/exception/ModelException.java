package com.chatty.chatty.game.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionType;

public class ModelException extends BaseException {

    public ModelException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
