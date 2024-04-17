package com.chatty.chatty.game.service.dynamodb;

import com.chatty.chatty.game.controller.dto.dynamodb.Question;
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

    private final DynamoDBRepository dynamoDBRepository;

    public List<Map<String, Object>> getQuizFromDB(String itemId, String timestamp) {
        return dynamoDBRepository.getQuizFromDB(itemId, timestamp);
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