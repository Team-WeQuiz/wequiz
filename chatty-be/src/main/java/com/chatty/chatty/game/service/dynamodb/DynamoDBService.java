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

    public List<Question> getQuizFromDB(Long itemId, String timestamp) {
        List<Map<String, Object>> questions = dynamoDBRepository.getQuizFromDB(itemId, timestamp);
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