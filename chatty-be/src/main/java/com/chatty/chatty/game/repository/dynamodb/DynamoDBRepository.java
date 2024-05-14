package com.chatty.chatty.game.repository.dynamodb;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Index;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.chatty.chatty.quizroom.controller.dto.ExistQuizListResponse.ExistQuiz;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@Slf4j
public class DynamoDBRepository {

    private static final String QUIZ_TABLE_NAME = "wequiz-quiz";
    private static final String MARK_TABLE_NAME = "wequiz-mark";
    private static final String USER_ID_INDEX_NAME = "user_id-index";
    private static final String HASH_KEY = "id";
    private static final String RANGE_KEY = "timestamp";
    private static final String QUIZ = "questions";
    private static final String DESCRIPTION = "description";
    private static final String NUMBER_OF_QUIZ = "num_of_quiz";
    private static final String ANSWERS = "answers";

    private final DynamoDB dynamoDB;

    public DynamoDBRepository(AmazonDynamoDB amazonDynamoDB) {
        this.dynamoDB = new DynamoDB(amazonDynamoDB);
    }

    public List<ExistQuiz> getExistQuizList(Long userId) {
        List<ExistQuiz> existQuizList = new ArrayList<>();

        Index index = dynamoDB.getTable(QUIZ_TABLE_NAME).getIndex(USER_ID_INDEX_NAME);

        QuerySpec spec = new QuerySpec()
                .withKeyConditionExpression("user_id = :val")
                .withValueMap(new ValueMap()
                        .withLong(":val", userId));

        ItemCollection<QueryOutcome> items = index.query(spec);
        for (Item item : items) {
            String quizDocId = item.getString(HASH_KEY);
            String description = item.getString(DESCRIPTION);
            Integer numberOfQuiz = item.getInt(NUMBER_OF_QUIZ);
            existQuizList.add(ExistQuiz.builder()
                    .quizDocId(quizDocId)
                    .description(description)
                    .numberOfQuiz(numberOfQuiz)
                    .build());
        }
        return existQuizList;
    }

    public String getDescriptionFromDB(String quizDocId) {
        Table table = dynamoDB.getTable(QUIZ_TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, quizDocId)
                .withProjectionExpression(DESCRIPTION);

        Item item = table.getItem(spec);

        return item.getString(DESCRIPTION);
    }

    public List<Map<String, Object>> getQuizFromDB(String quizDocId) {
        Table table = dynamoDB.getTable(QUIZ_TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, quizDocId)
                .withProjectionExpression(QUIZ);

        Item item = table.getItem(spec);
        log.info("Item: {}", item);

        return item.getList(QUIZ);
    }

    public List<Map<String, Object>> getMarkFromDB(String markDocId) {
        Table table = dynamoDB.getTable(MARK_TABLE_NAME);
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey(HASH_KEY, markDocId)
                .withProjectionExpression(ANSWERS);

        Item item = table.getItem(spec);
        log.info("Item: {}", item);

        return item.getList(ANSWERS);
    }
}
