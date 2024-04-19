package com.chatty.chatty.game.repository;

import com.chatty.chatty.game.controller.dto.PlayerAnswerRequest;
import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.quizroom.entity.QuizRoom;
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
    private final DynamoDBService dynamoDBService;

    private Optional<AnswerData> findByRoomId(Long roomId) {
        return Optional.ofNullable(answerDataMap.get(roomId));
    }

    private AnswerData initAnswerData(Long roomId, PlayerAnswerRequest playerAnswerRequest) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId).orElseThrow();

        AnswerData answerData = AnswerData.builder()
                .playerNum(quizRoom.getPlayerNum())
                .majorityNum((quizRoom.getPlayerNum() + 1) / 2)
                .quizNum(playerAnswerRequest.quizNum())
                .quizAnswer(playerAnswerRequest.quizAnswer())
                .build();
        updateAnswerMap(roomId, answerData);
        return answerData;
    }

    public synchronized void addPlayerAnswer(Long roomId, PlayerAnswerRequest playerAnswerRequest) {
        AnswerData answerData = findByRoomId(roomId).orElse(initAnswerData(roomId, playerAnswerRequest));

        answerData.addAnswer(playerAnswerRequest.playerId(), playerAnswerRequest.playerAnswer());
        countSubmittedPlayer(answerData);
    }

    private void countSubmittedPlayer(AnswerData answerData) {

    }

    private void clear(Long roomId) {
        answerDataMap.remove(roomId);
    }

    private void updateAnswerMap(Long roomId, AnswerData answerData) {
        answerDataMap.put(roomId, answerData);
    }
}