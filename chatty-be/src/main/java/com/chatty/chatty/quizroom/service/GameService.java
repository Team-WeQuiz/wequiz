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
        return PlayersStatusDTO.builder()
                .roomId(roomId)
                .playerStatuses(playersStatus.playerStatusSet())
                .build();
    }
}
