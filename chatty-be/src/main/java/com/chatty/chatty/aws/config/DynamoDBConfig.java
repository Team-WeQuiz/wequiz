package com.chatty.chatty.aws.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBAsyncClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DynamoDBConfig {

    private final AWSKey awsKey;

    @Bean
    public DynamoDBMapper dynamoDBMapper() {
        return new DynamoDBMapper(amazonDynamoDBClient());
    }

    private AmazonDynamoDBClient amazonDynamoDBClient() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsKey.getAccessKey(), awsKey.getSecretKey());
        return (AmazonDynamoDBClient) AmazonDynamoDBAsyncClientBuilder.standard()
                .withRegion(awsKey.getRegion())
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }
}
