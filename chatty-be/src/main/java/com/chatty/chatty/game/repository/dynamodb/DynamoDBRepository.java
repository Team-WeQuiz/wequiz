package com.chatty.chatty.game.repository.dynamodb;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class DynamoDBRepository {

    private static final String TABLE_NAME = "wequiz-quiz";
    private static final String HASH_KEY = "id";
    private static final String RANGE_KEY = "timestamp";
    private static final String QUIZ = "questions";
    private static final String DESCRIPTION = "description";
    private static final String ANSWER = "answer";

    private final AmazonDynamoDB amazonDynamoDB;
    private final DynamoDB dynamoDB;

    public DynamoDBRepository(AmazonDynamoDB amazonDynamoDB) {
        this.amazonDynamoDB = amazonDynamoDB;
        this.dynamoDB = new DynamoDB(amazonDynamoDB);
    }

    public String getDescriptionFromDB(String itemId, String timestamp) {
        Table table = dynamoDB.getTable(TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(DESCRIPTION);

        Item item = table.getItem(spec);

        return item.getString(DESCRIPTION);
    }

    public List<Map<String, Object>> getQuizFromDB(String itemId, String timestamp) {
        Table table = dynamoDB.getTable(TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(QUIZ);

        Item item = table.getItem(spec);

        return item.getList(QUIZ);
    }

    public String getAnswerFromDB(String itemId, String timestamp) {
        return item.getString(ANSWER);

    }
}
