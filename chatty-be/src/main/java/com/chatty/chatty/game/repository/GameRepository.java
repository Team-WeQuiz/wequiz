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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class GameRepository {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final Integer DEFAULT_ROUND = 0;
    private static final Integer QUIZ_PER_ROUND = 5;
    private static final Map<Long, QuizData> quizDataMap = new ConcurrentHashMap<>();
    private final QuizRoomRepository quizRoomRepository;
    private final DynamoDBService dynamoDBService;

    private Optional<QuizData> findByRoomId(Long roomId) {
        return Optional.ofNullable(quizDataMap.get(roomId));
    }

    // controller에서 비동기 처리
    public void initQuizData(Long roomId) {
        log.info("InitQuizData");
        QuizRoom quizRoom = quizRoomRepository.findById(roomId).orElseThrow();

        QuizData quizData = QuizData.builder()
                .quizDocId(quizRoom.getQuizDocId())
                .timestamp(quizRoom.getCreatedAt().format(formatter))
                .totalRound(quizRoom.getNumOfQuiz() / QUIZ_PER_ROUND)
                .currentRound(DEFAULT_ROUND)
                .dynamoDBService(dynamoDBService)
                .build();
        updateQuizMap(roomId, quizData);
        log.info("QuizMap: {}", quizDataMap);
        quizData.fillQuiz();
    }

    public String sendDescription(Long roomId) {
        QuizData quizData = findByRoomId(roomId).get();
        return quizData.pollingDescription();
    }

    public QuizResponse sendQuiz(Long roomId) {
        log.info("sendQuiz-repository roomId: {}", roomId);
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
