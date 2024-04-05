package com.chatty.chatty.quizroom.service;

import com.chatty.chatty.quizroom.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.quizroom.domain.PlayersStatus;
import com.chatty.chatty.quizroom.repository.PlayersStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameService {

    private final PlayersStatusRepository playersStatusRepository;

    public PlayersStatusDTO joinRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.saveUserToRoom(roomId, userId);
        return buildDTO(roomId, playersStatus);
    }

    public PlayersStatusDTO leaveRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.leaveRoom(roomId, userId);
        return buildDTO(roomId, playersStatus);
    }

    public PlayersStatusDTO toggleReady(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.toggleReady(roomId, userId);
        return buildDTO(roomId, playersStatus);
    }

    private PlayersStatusDTO buildDTO(Long roomId, PlayersStatus playersStatus) {
        return PlayersStatusDTO.builder()
                .roomId(roomId)
                .playerStatuses(playersStatus.playerStatusSet())
                .build();
    }
}
