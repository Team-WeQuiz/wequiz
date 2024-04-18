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
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;

@Builder
@Getter
@Slf4j
public class QuizData {
    private static final Integer QUIZ_PER_ROUND = 5;
    private static final Integer MAX_ATTEMPT = 120;
    private final Queue<Quiz> quizQueue = new LinkedList<>();
    private final String quizDocId;
    private final String timestamp;
    private Integer currQuizNum;
    private final DynamoDBService dynamoDBService;

    public Quiz sendQuiz() {
        while (quizQueue.isEmpty()) {
            wait5Sec();
        }
        log.info("quiz: {}", quizQueue.peek());
        return quizQueue.peek();
    }

    public void removeAndFillQuiz() {
        quizQueue.poll();

        if (quizQueue.isEmpty()) {
            this.currQuizNum = currQuizNum + QUIZ_PER_ROUND;
            fillQuiz();
        }
    }

    public void fillQuiz() {
        List<Quiz> quizzes = pollingQuiz();
        quizQueue.addAll(quizzes.subList(currQuizNum, currQuizNum + QUIZ_PER_ROUND));
        log.info("quizQueue: {}", quizQueue);
    }

    private List<Quiz> pollingQuiz() {
        List<Map<String, Object>> quizzes = dynamoDBService.getQuizFromDB(quizDocId, timestamp);
        while (quizzes.size() < currQuizNum + QUIZ_PER_ROUND) {
            wait5Sec();
            quizzes = dynamoDBService.getQuizFromDB(quizDocId, timestamp);
        }
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

    public String pollingDescription() {
        String description = dynamoDBService.getDescriptionFromDB(quizDocId, timestamp);
        int attempt = 0;
        while (description.equals("") && attempt < MAX_ATTEMPT) {
            wait5Sec();
            description = dynamoDBService.getDescriptionFromDB(quizDocId, timestamp);
            attempt++;
        }
        if (description.equals("")) {
            throw new RuntimeException("10분 동안 요약이 생성되지 않았으므로 데이터 가져오기를 중단합니다.");
        }
        return description;
    }

    private void wait5Sec() {
        try {
            Thread.sleep(5000);
            log.info("wake: {}", DateTime.now());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
