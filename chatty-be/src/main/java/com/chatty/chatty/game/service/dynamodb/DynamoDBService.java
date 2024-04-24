package com.chatty.chatty.game.service.dynamodb;

import static com.chatty.chatty.game.exception.GameExceptionType.FAILED_TO_FETCH_DESCRIPTION;
import static com.chatty.chatty.game.exception.GameExceptionType.THREAD_INTERRUPTED;

import com.chatty.chatty.game.controller.dto.dynamodb.Quiz;
import com.chatty.chatty.game.exception.GameException;
import com.chatty.chatty.game.repository.dynamodb.DynamoDBRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DynamoDBService {

    private static final Long QUIZ_POLLING_SLEEP_TIME = 10000L;
    private static final Long DESCRIPTION_POLLING_SLEEP_TIME = 5000L;
    private static final Long POLLING_MAX_ATTEMPTS = 120L;
    private static final Integer QUIZ_SIZE = 5;

    private final DynamoDBRepository dynamoDBRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public String pollDescription(String itemId, String timestamp) {
        int attempts = 0;
        String description = dynamoDBRepository.getDescriptionFromDB(itemId, timestamp);
        while (description.isEmpty() && attempts < POLLING_MAX_ATTEMPTS) {
            sleep(DESCRIPTION_POLLING_SLEEP_TIME);
            attempts++;
            description = dynamoDBRepository.getDescriptionFromDB(itemId, timestamp);
        }
        if (description.isEmpty()) {
            throw new GameException(FAILED_TO_FETCH_DESCRIPTION);
        }
        return description;
    }

    public List<Quiz> pollQuizzes(String itemId, String timestamp) {
        List<Map<String, Object>> rawQuizzes = dynamoDBRepository.getQuizFromDB(itemId, timestamp);
        while (rawQuizzes.size() < QUIZ_SIZE) {
            sleep(QUIZ_POLLING_SLEEP_TIME);
            rawQuizzes = dynamoDBRepository.getQuizFromDB(itemId, timestamp);
        }
        return convertToList(rawQuizzes);
    }

    private List<Quiz> convertToList(List<Map<String, Object>> listMap) {
        List<Quiz> quizzes = new ArrayList<>();
        for (Map<String, Object> value : listMap) {
            Quiz quiz = mapper.convertValue(value, Quiz.class);
            quizzes.add(quiz);
        }
        return quizzes;
    }

    private void sleep(Long sleepTime) {
        try {
            Thread.sleep(sleepTime);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new GameException(THREAD_INTERRUPTED);
        }
    }
}