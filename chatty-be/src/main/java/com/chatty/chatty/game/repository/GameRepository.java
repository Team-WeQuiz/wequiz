package com.chatty.chatty.game.repository;

import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.domain.QuizData;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GameRepository {
    private static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private static final Integer DEFAULT_ROUND = 0;
    private static final Map<Long, QuizData> quizDataMap = new ConcurrentHashMap<>();
    private final QuizRoomRepository quizRoomRepository;
    private final DynamoDBService dynamoDBService;

    private Optional<QuizData> findByRoomId(Long roomId) {
        return Optional.ofNullable(quizDataMap.get(roomId));
    }

    // controller에서 비동기 처리
    public void initQuizData(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId).orElseThrow();
        String quizDocId = quizRoom.getQuizDocId();
        String timestamp = quizRoom.getCreatedAt().format(DateTimeFormatter.ofPattern(DATETIME_FORMAT));

        QuizData quizData = QuizData.builder()
                .quizDocId(quizDocId)
                .timestamp(timestamp)
                .currRound(DEFAULT_ROUND)
                .dynamoDBService(dynamoDBService)
                .build();
        quizData.fillQuiz();
        updateQuizMap(roomId, quizData);
    }

    public String sendDescription(Long roomId) {
        QuizData quizData = findByRoomId(roomId).get();
        return quizData.pollingDescription();
    }

    public QuizResponse sendQuiz(Long roomId) {
        QuizData quizData = findByRoomId(roomId).get();
        return quizData.sendQuiz();
    }

    // controller에서 비동기 처리
    public void removeQuiz(Long roomId) {
        QuizData quizData = findByRoomId(roomId).get();
        quizData.removeAndFillQuiz();
    }

    private void clear(Long roomId) {
        quizDataMap.remove(roomId);
    }

    private void updateQuizMap(Long roomId, QuizData quizData) {
        quizDataMap.put(roomId, quizData);
    }
}
