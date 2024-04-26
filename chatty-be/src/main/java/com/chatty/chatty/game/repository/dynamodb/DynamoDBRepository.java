package com.chatty.chatty.game.repository.dynamodb;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.chatty.chatty.config.AWSKey;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class DynamoDBRepository {

    private static final String TABLE_NAME = "wequiz-quiz";
    private static final String HASH_KEY = "id";
    private static final String RANGE_KEY = "timestamp";
    private static final String QUIZ = "questions";
    private static final String DESCRIPTION = "description";

    private final AmazonDynamoDB amazonDynamoDB;
    private final DynamoDB dynamoDB;
    private final AWSKey awsKey;

    public DynamoDBRepository(AmazonDynamoDB amazonDynamoDB, AWSKey awsKey) {
        this.amazonDynamoDB = amazonDynamoDB;
        this.dynamoDB = new DynamoDB(amazonDynamoDB);
        this.awsKey = awsKey;
    }

    public String getDescriptionFromDB(String itemId, String timestamp) {
        log.info("aws Key {}:", awsKey.getAccessKey());
        log.info("aws Secret Key {}:", awsKey.getSecretKey());
        log.info("aws Region {}:", awsKey.getRegion());
        log.info("Getting description from DB for itemId: {} and timestamp: {}", itemId, timestamp);
        Table table = dynamoDB.getTable(TABLE_NAME);
        log.info("Table: {}", table);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(DESCRIPTION);
        log.info("Spec: {}", spec);

        Item item = table.getItem(spec);

        log.info("Item: {}", item);

        return item.getString(DESCRIPTION);
    }

    public List<Map<String, Object>> getQuizFromDB(String itemId, String timestamp) {
        Table table = dynamoDB.getTable(TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, itemId, RANGE_KEY, timestamp)
                .withProjectionExpression(QUIZ);

        Item item = table.getItem(spec);
        log.info("Item: {}", item);

        return item.getList(QUIZ);
    }
}
