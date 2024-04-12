package com.chatty.chatty.config.minio;

import static com.chatty.chatty.config.minio.exception.MinioExceptionType.FAILED_TO_SAVE_FILE;

import com.chatty.chatty.config.minio.exception.MinioException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import java.io.InputStream;
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

    private final MinioClient minioClient;

    @Value("${minio.bucket.pdf}")
    private String bucketName;

    public String saveFile(Long userId, InputStream stream) {
        String pdfFileName = filePathBuilder(userId);
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

    private String filePathBuilder(Long userId) {
        return userId + PDF_PREFIX + randomFileName() + PDF_POSTFIX;
    }

    private String randomFileName() {
        return "/file-" + UUID.randomUUID();
    }
}