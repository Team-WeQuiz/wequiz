package com.chatty.chatty.aws.service;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.chatty.chatty.aws.entity.DBQuizResponse;
import com.chatty.chatty.aws.entity.Question;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DynamoDBService {

    @Autowired
    private DynamoDBMapper mapper;

    public DBQuizResponse getData() {
        DBQuizResponse response = mapper.load(DBQuizResponse.class, 22222222, "2024-04-10");
        if (response == null) {
            throw new RuntimeException("Data not found for id: ");
        }

        List<Question> questions = convert(response.getQuestions());
        System.out.println(questions);

        return response;
    }

    public List<Question> convert(List<Map<String, AttributeValue>> items) {
        List<Question> questions = new ArrayList<>();

        for (Map<String, AttributeValue> item : items) {
            String id = item.get("id").getS();
            Integer questionNumber = Integer.parseInt(item.get("question_number").getN());
            String type = item.get("type").getS();
            String question = item.get("question").getS();
            List<String> options = item.get("options").getL().stream()
                    .map(AttributeValue::getS)
                    .toList();
            String answer = item.get("answer").getS();

            Question q = new Question(id, questionNumber, type, question, options, answer);
            questions.add(q);
        }

        return questions;
    }

}