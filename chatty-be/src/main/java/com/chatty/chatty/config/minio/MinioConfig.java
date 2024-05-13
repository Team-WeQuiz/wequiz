package com.chatty.chatty.config.minio;

import static com.chatty.chatty.config.minio.exception.MinioExceptionType.IGNORE_CERT_CHECK_FAILED;

import com.chatty.chatty.config.minio.exception.MinioException;
import io.minio.MinioClient;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class MinioConfig {

    @Value("${minio.access.key}")
    private String accessKey;

    @Value("${minio.access.secret}")
    private String secretKey;

    @Value("${minio.endpoint}")
    private String endpoint;

    @Bean
    public MinioClient init() {
        MinioClient minioClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
        try {
            minioClient.ignoreCertCheck();
        } catch (KeyManagementException | NoSuchAlgorithmException e) {
            throw new MinioException(IGNORE_CERT_CHECK_FAILED);
        }
        return minioClient;
    }
}
