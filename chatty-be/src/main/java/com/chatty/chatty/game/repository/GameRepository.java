package com.chatty.chatty.game.repository;

import com.chatty.chatty.game.controller.dto.dynamodb.Question;
import com.chatty.chatty.game.domain.QuizQueue;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GameRepository {

    private static final Map<Long, QuizQueue> quizQueueMap = new ConcurrentHashMap<>();

    private Optional<QuizQueue> findQueueByRoomId(Long roomId) {
        return Optional.ofNullable(quizQueueMap.get(roomId));
    }

    public void initQuizQueue(Long roomId) {
        QuizQueue quizQueue = QuizQueue.init();
        quizQueue.fillQuiz(roomId);
        updateQueue(roomId, quizQueue);
    }

    public Question sendQuiz(Long roomId) {
        // TODO: isPresent
        QuizQueue quizQueue = findQueueByRoomId(roomId).get();
        return quizQueue.sendQuiz();
    }

    private void removeQuiz(Long roomId) {
        QuizQueue quizQueue = findQueueByRoomId(roomId).get();
        quizQueue.removeAndFillQuiz(roomId);
        updateQueue(roomId, quizQueue);
    }

    public void clear(Long roomId) {
        quizQueueMap.remove(roomId);
    }

    private void updateQueue(Long roomId, QuizQueue quizQueue) {
        quizQueueMap.put(roomId, quizQueue);
    }
}
