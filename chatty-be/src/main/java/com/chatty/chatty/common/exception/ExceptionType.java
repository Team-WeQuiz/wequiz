package com.chatty.chatty.common.exception;

public interface ExceptionType {

    Status status();

    int exceptionCode();

    String message();
}
