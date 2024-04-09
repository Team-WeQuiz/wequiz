package com.chatty.chatty.quizroom.service;

import com.chatty.chatty.quizroom.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.quizroom.domain.PlayersStatus;
import com.chatty.chatty.quizroom.repository.PlayersStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final PlayersStatusRepository playersStatusRepository;

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

    private PlayersStatusDTO buildDTO(Long roomId, PlayersStatus playersStatus) {
        return PlayersStatusDTO.builder()
                .roomId(roomId)
                .playerStatuses(playersStatus.playerStatusSet())
                .build();
    }
}
