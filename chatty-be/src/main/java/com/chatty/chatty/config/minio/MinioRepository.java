package com.chatty.chatty.config.minio;

import static com.chatty.chatty.config.minio.exception.MinioExceptionType.FAILED_TO_DELETE_FILE;
import static com.chatty.chatty.config.minio.exception.MinioExceptionType.FAILED_TO_GET_FILE_URL;
import static com.chatty.chatty.config.minio.exception.MinioExceptionType.FAILED_TO_SAVE_FILE;

import com.chatty.chatty.common.util.Sha256Encrypt;
import com.chatty.chatty.config.minio.exception.MinioException;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private String pdfBucketName;

    @Value("${minio.bucket.profileImage}")
    private String profileImageBucketName;

    public String savePdf(Long userId, LocalDateTime time, InputStream stream) {
        String pdfFileName = filePathBuilder(userId, time);
        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(pdfBucketName)
                    .object(pdfFileName)
                    .stream(stream, stream.available(), -1)
                    .build()
            );
        } catch (Exception e) {
            throw new MinioException(FAILED_TO_SAVE_FILE);
        }
        return pdfFileName;
    }

    public void saveProfileImage(Long userId, InputStream stream) {
        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(profileImageBucketName)
                    .object(String.valueOf(userId))
                    .stream(stream, stream.available(), -1)
                    .build()
            );
        } catch (Exception e) {
            throw new MinioException(FAILED_TO_SAVE_FILE);
        }
    }

    public String getProfileImageUrl(String profileImageBucketName) {
        Map<String, String> reqParams = new HashMap<>();
        reqParams.put("response-content-type", "application/json");
        try {
            return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .method(Method.PUT)
                    .bucket(profileImageBucketName)
                    .object(profileImageBucketName)
                    .expiry(60 * 60 * 24)
                    .extraQueryParams(reqParams)
                    .build());
        } catch (Exception e) {
            throw new MinioException(FAILED_TO_GET_FILE_URL);
        }
    }

    public void deleteFiles(List<String> fileNames) {
        try {
            for (String fileName : fileNames) {
                deleteFile(fileName);
            }
        } catch (Exception e) {
            throw new MinioException(FAILED_TO_DELETE_FILE);
        }
    }

    private void deleteFile(String fileName) throws Exception {
        minioClient.removeObject(RemoveObjectArgs.builder()
                .bucket(pdfBucketName)
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