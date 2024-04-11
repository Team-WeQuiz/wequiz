package com.chatty.chatty.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class AWSKey {

    @Value("${aws.access-key}")
    private String accessKey;

    @Value("${aws.secret-access-key}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

}
