package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.dynamodb.Quiz;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class QuizData {
    private static final Integer QUIZ_PER_ROUND = 5;
    private final Queue<Quiz> quizQueue = new LinkedList<>();
    private final String quizDocId;
    private final String timestamp;
    private Integer currQuizNum;
    private final DynamoDBService dynamoDBService;

    public Quiz sendQuiz() {
        // TODO: send 요청 수 세서 인원수만큼 받으면 요청 하나로 처리해서 반환
        if (quizQueue.isEmpty()) {
            fillQuiz();
        }
        return quizQueue.peek();
    }

    public void removeQuiz() {
        quizQueue.poll();
    }

    public void fillQuiz() {
        List<Quiz> quizzes = pollingQuiz();
        quizQueue.addAll(quizzes.subList(currQuizNum, currQuizNum + QUIZ_PER_ROUND));
    }

    private List<Quiz> pollingQuiz() {
        List<Map<String, Object>> quizzes = dynamoDBService.getQuizFromDB(quizDocId, timestamp);
        while (quizzes.size() < currQuizNum + QUIZ_PER_ROUND) {
            quizzes = dynamoDBService.getQuizFromDB(quizDocId, timestamp);
            // TODO: 5초마다 요청
        }
        this.currQuizNum = currQuizNum + QUIZ_PER_ROUND;
        return convertToList(quizzes);
    }

    private List<Quiz> convertToList(List<Map<String, Object>> listMap) {
        ObjectMapper mapper = new ObjectMapper();
        List<Quiz> quizzes = new ArrayList<>();

        for (Map<String, Object> value : listMap) {
            Quiz quiz = mapper.convertValue(value, Quiz.class);
            quizzes.add(quiz);
        }
        return quizzes;
    }
}
