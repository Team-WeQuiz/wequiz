package com.chatty.chatty.aws.service;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.chatty.chatty.aws.entity.Question;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DynamoDBService {

    private final AmazonDynamoDB amazonDynamoDB;
    private final DynamoDB dynamoDB;

    public DynamoDBService(AmazonDynamoDB amazonDynamoDB) {
        this.amazonDynamoDB = amazonDynamoDB;
        this.dynamoDB = new DynamoDB(amazonDynamoDB);
    }

    public String getDescriptionFromDB(Integer hashKey, String rangeKey) {
        Table table = dynamoDB.getTable("wequiz-quiz");
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey("id", hashKey, "timestamp", rangeKey)
                .withProjectionExpression("description");

        Item item = table.getItem(spec);

        String description = item.getString("description");
        log.info("description: {}", description);
        return description;
    }

    public List<Question> getQuizFromDB(Integer hashKey, String rangeKey) {
        Table table = dynamoDB.getTable("wequiz-quiz");
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey("id", hashKey, "timestamp", rangeKey)
                .withProjectionExpression("questions");

        Item item = table.getItem(spec);

        List<Map<String, Object>> questions = item.getList("questions");
        return convertToList(questions);
    }

    private List<Question> convertToList(List<Map<String, Object>> listMap) {
        ObjectMapper mapper = new ObjectMapper();
        List<Question> questions = new ArrayList<>();

        for (Map<String, Object> value : listMap) {
            Question question = mapper.convertValue(value, Question.class);
            questions.add(question);
        }
        return questions;
    }
}