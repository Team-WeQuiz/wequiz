package com.chatty.chatty.config.minio.exception;

import com.chatty.chatty.common.exception.BaseException;
import com.chatty.chatty.common.exception.ExceptionType;

public class MinioException extends BaseException {

    public MinioException(ExceptionType exceptionType) {
        super(exceptionType);
    }
}
