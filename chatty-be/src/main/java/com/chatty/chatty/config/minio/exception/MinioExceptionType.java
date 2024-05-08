package com.chatty.chatty.config.minio.exception;

import com.chatty.chatty.common.exception.ExceptionType;
import com.chatty.chatty.common.exception.Status;

public enum MinioExceptionType implements ExceptionType {
    IGNORE_CERT_CHECK_FAILED(Status.SERVER_ERROR, 6001, "SSL 인증서 무시 설정에 실패했습니다"),
    BUCKET_NOT_FOUND(Status.SERVER_ERROR, 6002, "버킷을 찾을 수 없습니다"),
    FAILED_TO_SAVE_FILE(Status.SERVER_ERROR, 6003, "파일 저장에 실패했습니다"),
    FAILED_TO_DELETE_FILE(Status.SERVER_ERROR, 6004, "파일 삭제에 실패했습니다");

    private final Status status;
    private final int exceptionCode;
    private final String message;

    MinioExceptionType(Status status, int exceptionCode, String message) {
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
