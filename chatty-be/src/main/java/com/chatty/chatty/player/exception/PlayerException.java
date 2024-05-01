package com.chatty.chatty.player.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionType;

public class PlayerException extends BaseException {

    public PlayerException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
