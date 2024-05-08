package com.chatty.chatty.config.minio;

import static com.chatty.chatty.config.minio.exception.MinioExceptionType.FAILED_TO_DELETE_FILE;
import static com.chatty.chatty.config.minio.exception.MinioExceptionType.FAILED_TO_SAVE_FILE;

import com.chatty.chatty.common.util.Sha256Encrypt;
import com.chatty.chatty.config.minio.exception.MinioException;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.RemoveObjectsArgs;
import io.minio.Result;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;
import io.minio.messages.DeleteError;
import io.minio.messages.DeleteObject;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class MinioRepository {

    private static final String PDF_PREFIX = "/pdf";
    private static final String PDF_POSTFIX = ".pdf";
    private static final String FILE_PREFIX = "/file-";

    private final MinioClient minioClient;

    @Value("${minio.bucket.pdf}")
    private String bucketName;

    public String saveFile(Long userId, LocalDateTime time, InputStream stream) {
        String pdfFileName = filePathBuilder(userId, time);
        log.info("saveFIle - pdfFileName: {}", pdfFileName);
        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(pdfFileName)
                    .stream(stream, stream.available(), -1)
                    .build()
            );
        } catch (Exception e) {
            throw new MinioException(FAILED_TO_SAVE_FILE);
        }
        return pdfFileName;
    }

    public void deleteFiles(List<String> fileNames) {
        try {
            for (String fileName : fileNames) {
                log.info("deleteFiles - fileName: {}", fileName);
                deleteFile(fileName);
            }
        } catch (Exception e) {
            throw new MinioException(FAILED_TO_DELETE_FILE);
        }
    }

    private void deleteFile(String fileName) throws Exception {
        minioClient.removeObject(RemoveObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .build());
    }

    private String filePathBuilder(Long userId, LocalDateTime time) {
        return getEncrypt(userId, time) + PDF_PREFIX + randomFileName() + PDF_POSTFIX;
    }

    private String getEncrypt(Long userId, LocalDateTime time) {
        return Sha256Encrypt.encrypt(userId + time.toString());
    }

    private String randomFileName() {
        return FILE_PREFIX + UUID.randomUUID();
    }
}