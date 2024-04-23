package com.chatty.chatty.config.minio;

import static com.chatty.chatty.config.minio.exception.MinioExceptionType.FAILED_TO_SAVE_FILE;

import com.chatty.chatty.common.util.Sha256Encrypt;
import com.chatty.chatty.config.minio.exception.MinioException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import java.io.InputStream;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    public void saveFile(Long userId, LocalDateTime time, InputStream stream) {
        String pdfFileName = filePathBuilder(userId, time);
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
    }

    private String filePathBuilder(Long userId, LocalDateTime time) {
        return Sha256Encrypt.encrypt(userId + time.toString()) + PDF_PREFIX + randomFileName() + PDF_POSTFIX;
    }

    private String randomFileName() {
        return FILE_PREFIX + UUID.randomUUID();
    }
}