package com.chatty.chatty.game.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionType;

public class GameException extends BaseException {

    public GameException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
