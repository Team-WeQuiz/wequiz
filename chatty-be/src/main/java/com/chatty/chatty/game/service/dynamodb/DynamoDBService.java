package com.chatty.chatty.game.service.dynamodb;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.chatty.chatty.game.controller.dto.dynamodb.Question;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class DynamoDBService {

    private static final String TABLE_NAME = "wequiz-quiz";
    private static final String HASH_KEY = "id";
    private static final String RANGE_KEY = "timestamp";
    private static final String QUESTIONS_ATTR_NAME = "questions";

    private final AmazonDynamoDB amazonDynamoDB;
    private final DynamoDB dynamoDB;

    public DynamoDBService(AmazonDynamoDB amazonDynamoDB) {
        this.amazonDynamoDB = amazonDynamoDB;
        this.dynamoDB = new DynamoDB(amazonDynamoDB);
    }

    public List<Question> getQuizFromDB(Long itemId, String timestamp) {
        Table table = dynamoDB.getTable(TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(QUESTIONS_ATTR_NAME);

        Item item = table.getItem(spec);

        List<Map<String, Object>> questions = item.getList(QUESTIONS_ATTR_NAME);
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