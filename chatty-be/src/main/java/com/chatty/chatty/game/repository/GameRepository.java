package com.chatty.chatty.game.repository;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;

import com.chatty.chatty.game.domain.QuizData;
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

    public QuizData getQuizData(Long roomId) {
        return quizDataMap.computeIfAbsent(roomId, this::initQuizData);
    }

    private QuizData initQuizData(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        return QuizData.builder()
                .quizDocId(quizRoom.getQuizDocId())
                .timestamp(quizRoom.getCreatedAt().toString())
                .totalRound(quizRoom.getNumOfQuiz() / QUIZ_PER_ROUND)
                .currentRound(DEFAULT_ROUND)
                .build();
    }
}
