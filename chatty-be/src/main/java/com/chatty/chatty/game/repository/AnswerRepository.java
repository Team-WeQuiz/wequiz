package com.chatty.chatty.game.repository;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;

import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.domain.QuizData;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AnswerRepository {

    private static final Map<Long, AnswerData> answerDataMap = new ConcurrentHashMap<>();

    private final QuizRoomRepository quizRoomRepository;
    private final GameRepository gameRepository;

    public AnswerData getAnswerData(Long roomId, Integer quizNum) {
        return answerDataMap.computeIfAbsent(roomId, id -> initAnswerData(id, quizNum));
    }

    private AnswerData initAnswerData(Long roomId, Integer quizNum) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        QuizData quizData = gameRepository.getQuizData(roomId);

        return AnswerData.builder()
                .playerNum(quizRoom.getPlayerNum())
                .majorityNum((quizRoom.getPlayerNum() + 1) / 2)
                .quizId(quizData.getQuiz().id())
                .quizNum(quizNum)
                .correct(quizData.getQuiz().correct())
                .build();
    }

    public void clearAnswerData(Long roomId) {
        answerDataMap.remove(roomId);
    }
}
