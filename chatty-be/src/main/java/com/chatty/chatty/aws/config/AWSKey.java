package com.chatty.chatty.aws.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class AWSKey {

    @Value("${spring.aws.access-key}")
    private String accessKey;

    @Value("${spring.aws.secret-access-key}")
    private String secretKey;

    @Value("${spring.aws.region}")
    private String region;

}
