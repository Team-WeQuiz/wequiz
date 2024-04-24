package com.chatty.chatty.game.repository;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;

import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.domain.SubmitStatus;
import com.chatty.chatty.game.repository.dynamodb.DynamoDBRepository;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AnswerRepository {
    private static final Map<Long, AnswerData> answerDataMap = new ConcurrentHashMap<>();
    private final QuizRoomRepository quizRoomRepository;
    private final DynamoDBRepository dynamoDBRepository;

    private Optional<AnswerData> findByRoomId(Long roomId) {
        return Optional.ofNullable(answerDataMap.get(roomId));
    }

    private AnswerData initAnswerData(Long roomId, SubmitAnswerRequest request) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        // String correct = dynamoDBRepository.getAnswerFromDB(quizRoom.getQuizDocId(), quizRoom.getCreatedAt().toString();

        AnswerData answerData = AnswerData.builder()
                .playerNum(quizRoom.getPlayerNum())
                .majorityNum((quizRoom.getPlayerNum() + 1) / 2)
                .quizNum(request.quizNum())
                .correct())
                .build();
        answerDataMap.put(roomId, answerData);
        return answerData;
    }

    public SubmitStatus addPlayerAnswer(Long roomId, SubmitAnswerRequest request) {
        AnswerData answerData = findByRoomId(roomId).orElse(initAnswerData(roomId, request));

        return answerData.addAnswer(request.playerId(), request.playerAnswer());
    }

    public void clearAnswer(Long roomId) {
        answerDataMap.remove(roomId);
    }
}
