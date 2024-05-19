package com.chatty.chatty.game.repository;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;

import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.domain.QuizData;
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
        return answerDataMap.computeIfAbsent(roomId, this::initAnswerData);
    }

    private AnswerData initAnswerData(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        QuizData quizData = gameRepository.getQuizData(roomId);
        int majorityNum = (quizRoom.getPlayerNum() == 2) ? 1 : (quizRoom.getPlayerNum() / 2 + 1);

        return AnswerData.builder()
                .playerNum(quizRoom.getPlayerNum())
                .majorityNum(majorityNum)
                .quizId(quizData.getQuiz().id())
                .quizNum(quizData.getQuiz().questionNumber())
                .quizType(quizData.getQuiz().type())
                .correct(quizData.getQuiz().correct())
                .startedTime(LocalDateTime.now())
                .build();
    }

    public void clearAnswerData(Long roomId) {
        answerDataMap.remove(roomId);
        log.info("Clear Answer Map: answerDataMap.get(roomId): {}", answerDataMap.get(roomId));
    }
}
