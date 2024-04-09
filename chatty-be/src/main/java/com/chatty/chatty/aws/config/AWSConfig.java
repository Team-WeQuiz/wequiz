package com.chatty.chatty.aws.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

@Getter
@Configuration
@Slf4j
public class AWSConfig {

    private final String accessKey;
    private final String secretKey;
    private final String region;

    public AWSConfig() {
        Map<String, String> awsKey = stringToMap(getSecret());
        this.accessKey = awsKey.get("AWS_ACCESS_KEY");
        this.secretKey = awsKey.get("AWS_SECRET_ACCESS_KEY");
        this.region = "ap-northeast-2";
    }

    private Map<String, String> stringToMap(String value) {
        ObjectMapper objectMapper = new ObjectMapper();
        TypeReference<Map<String, String>> typeReference = new TypeReference<Map<String, String>>() {
        };

        Map<String, String> awsKey = new HashMap<>();
        try {
            awsKey = objectMapper.readValue(value, typeReference);
        } catch (JsonMappingException e) {
            log.error("JSON 구조와 매핑 문제 발생: {}", e.getMessage());
        } catch (JsonProcessingException e) {
            log.error("JSON 처리 중 예외 발생: {}", e.getMessage());
        }
        return awsKey;
    }

    private String getSecret() {

        String secretName = "wequiz/aws/back";
        Region region = Region.of("ap-northeast-2");

        // Create a Secrets Manager client
        SecretsManagerClient client = SecretsManagerClient.builder()
                .region(region)
                .build();

        GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
                .secretId(secretName)
                .build();

        GetSecretValueResponse getSecretValueResponse;

        try {
            getSecretValueResponse = client.getSecretValue(getSecretValueRequest);
        } catch (Exception e) {
            // For a list of exceptions thrown, see
            // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            throw e;
        }

        return getSecretValueResponse.secretString();
    }
}