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
    private static final String QUIZ_ATTR_NAME = "questions";
    private static final String DESCRIPTION_ATTR_NAME = "description";

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
                .withProjectionExpression(DESCRIPTION_ATTR_NAME);

        Item item = table.getItem(spec);

        return item.getString(DESCRIPTION_ATTR_NAME);
    }

    public List<Map<String, Object>> getQuizFromDB(String itemId, String timestamp) {
        Table table = dynamoDB.getTable(TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(QUIZ_ATTR_NAME);

        Item item = table.getItem(spec);

        return item.getList(QUIZ_ATTR_NAME);
    }
}
