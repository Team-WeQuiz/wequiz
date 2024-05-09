package com.chatty.chatty.game.repository.dynamodb;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class DynamoDBRepository {

    private static final String QUIZ_TABLE_NAME = "wequiz-quiz";
    private static final String MARK_TABLE_NAME = "wequiz-mark";
    private static final String HASH_KEY = "id";
    private static final String RANGE_KEY = "timestamp";
    private static final String QUIZ = "questions";
    private static final String DESCRIPTION = "description";
    private static final String ANSWERS = "answers";

    private final DynamoDB dynamoDB;

    public DynamoDBRepository(AmazonDynamoDB amazonDynamoDB) {
        this.dynamoDB = new DynamoDB(amazonDynamoDB);
    }

    public String getDescriptionFromDB(String itemId, String timestamp) {
        log.info("Getting description from DB for itemId: {} and timestamp: {}", itemId, timestamp);
        Table table = dynamoDB.getTable(QUIZ_TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(DESCRIPTION);

        Item item = table.getItem(spec);
        log.info("Item: {}", item);

        return item.getString(DESCRIPTION);
    }

    public List<Map<String, Object>> getQuizFromDB(String itemId, String timestamp) {
        Table table = dynamoDB.getTable(QUIZ_TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(QUIZ);

        Item item = table.getItem(spec);
        log.info("Item: {}", item);

        return item.getList(QUIZ);
    }

    public List<Map<String, Object>> getMarkFromDB(String itemId) {
        Table table = dynamoDB.getTable(MARK_TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId)
                .withProjectionExpression(ANSWERS);

        Item item = table.getItem(spec);
        log.info("Item: {}", item);

        return item.getList(ANSWERS);
    }
}
