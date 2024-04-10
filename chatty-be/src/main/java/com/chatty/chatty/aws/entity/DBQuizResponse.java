package com.chatty.chatty.aws.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@NoArgsConstructor
@AllArgsConstructor
@DynamoDBTable(tableName = "wequiz-quiz")
public class DBQuizResponse {

    @DynamoDBHashKey(attributeName = "id")
    private Integer id;

    @DynamoDBRangeKey(attributeName = "timestamp")
    private String timestamp;

    @DynamoDBAttribute(attributeName = "user_id")
    private Integer userId;

    @DynamoDBAttribute(attributeName = "description")
    private String description;

    @DynamoDBAttribute(attributeName = "questions")
    private List<Map<String, AttributeValue>> questions;
}
