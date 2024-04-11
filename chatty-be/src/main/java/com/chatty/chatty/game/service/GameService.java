package com.chatty.chatty.game.service;

import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.player.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.player.domain.PlayersStatus;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final PlayersStatusRepository playersStatusRepository;
    private final QuizRoomRepository quizRoomRepository;
    private final DynamoDBService dynamoDBService;

    public PlayersStatusDTO joinRoom(Long roomId, Long userId) {
        log.info("joinRoom: roomId: {}, userId: {}", roomId, userId);
        PlayersStatus playersStatus = playersStatusRepository.saveUserToRoom(roomId, userId);
        PlayersStatusDTO playersStatusDTO = buildDTO(roomId, playersStatus);
        log.info("joinRoom: {}", playersStatusDTO);
        return playersStatusDTO;
    }

    public PlayersStatusDTO leaveRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.leaveRoom(roomId, userId);
        return buildDTO(roomId, playersStatus);
    }

    public PlayersStatusDTO toggleReady(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.toggleReady(roomId, userId);
        return buildDTO(roomId, playersStatus);
    }

    public void endGame(Long roomId) {
        playersStatusRepository.clear(roomId);
    }

    public String getDescription(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId).orElseThrow();
        // Long quizDocId = quizRoom.getQuizDocId();
        String timestamp = quizRoom.getCreatedAt().toString();
        String description = dynamoDBService.getFromDB(roomId, timestamp);
        return description;
    }

    private PlayersStatusDTO buildDTO(Long roomId, PlayersStatus playersStatus) {
        return PlayersStatusDTO.builder()
                .roomId(roomId)
                .playerStatuses(playersStatus.playerStatusSet())
                .build();
    }
}
