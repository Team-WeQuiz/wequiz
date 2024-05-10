package com.chatty.chatty.game.repository;

import static com.chatty.chatty.game.exception.GameExceptionType.FAILED_TO_SUBMIT_ANSWER;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;

import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.domain.QuizData;
import com.chatty.chatty.game.exception.GameException;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class AnswerRepository {

    private static final Map<Long, AnswerData> answerDataMap = new ConcurrentHashMap<>();

    private final QuizRoomRepository quizRoomRepository;
    private final GameRepository gameRepository;

    public AnswerData getAnswerData(Long roomId) {
        AnswerData answerData = answerDataMap.get(roomId);
        if (answerData == null) {
            throw new GameException(FAILED_TO_SUBMIT_ANSWER);
        }
        return answerData;
    }

    public void initAnswerDataIfAbsent(Long roomId) {
        answerDataMap.computeIfAbsent(roomId, this::initAnswerData);
    }

    private AnswerData initAnswerData(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        QuizData quizData = gameRepository.getQuizData(roomId);
        quizData.increaseNextQuizNumber();
        return AnswerData.builder()
                .playerNum(quizRoom.getPlayerNum())
                .majorityNum((quizRoom.getPlayerNum() + 1) / 2)
                .quizId(quizData.getQuiz().id())
                .quizNum(quizData.getQuiz().questionNumber())
                .correct(quizData.getQuiz().correct())
                .startedTime(LocalDateTime.now())
                .build();
    }

    public void clearAnswerData(Long roomId) {
        answerDataMap.remove(roomId);
        log.info("Clear Answer Map: answerDataMap.get(roomId): {}", answerDataMap.get(roomId));
    }
}
