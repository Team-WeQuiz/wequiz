package com.chatty.chatty.game.repository;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;

import com.chatty.chatty.game.domain.QuizData;
import com.chatty.chatty.game.repository.dynamodb.DynamoDBRepository;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class GameRepository {

    private static final Integer DEFAULT_ROUND = 0;
    private static final Integer QUIZ_PER_ROUND = 5;
    private static final Map<Long, QuizData> quizDataMap = new ConcurrentHashMap<>();

    private final QuizRoomRepository quizRoomRepository;
    private final DynamoDBRepository dynamoDBRepository;

    public QuizData getQuizData(Long roomId) {
        return quizDataMap.computeIfAbsent(roomId, this::initQuizData);
    }

    private QuizData initQuizData(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        String quizDocId = quizRoom.getQuizDocId();
        String timestamp = dynamoDBRepository.getTimeStampFromDB(quizRoom.getQuizDocId());
        Integer numOfQuiz = dynamoDBRepository.getQuizFromDB(quizDocId, timestamp).size();
        log.info("Init Quiz Data: roomId: {}", roomId);
        return QuizData.builder()
                .quizDocId(quizDocId)
                .timestamp(timestamp)
                .totalRound(numOfQuiz / QUIZ_PER_ROUND)
                .currentRound(DEFAULT_ROUND)
                .build();
    }

    public void clearQuizData(Long roomId) {
        quizDataMap.remove(roomId);
    }
}
