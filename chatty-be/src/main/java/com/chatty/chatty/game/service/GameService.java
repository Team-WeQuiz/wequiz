package com.chatty.chatty.game.service;

import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.repository.GameRepository;
import com.chatty.chatty.player.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.player.domain.PlayersStatus;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final PlayersStatusRepository playersStatusRepository;
    private final GameRepository gameRepository;
    private final QuizRoomService quizRoomService;

    public PlayersStatusDTO joinRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.saveUserToRoom(roomId, userId);
        quizRoomService.broadcastUpdatedRoomList();
        return buildDTO(roomId, playersStatus);
    }

    public PlayersStatusDTO leaveRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.leaveRoom(roomId, userId);
        quizRoomService.broadcastUpdatedRoomList();
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

    public QuizResponse sendQuiz(Long roomId) {
        return gameRepository.sendQuiz(roomId);
    }

    public void removeQuiz(Long roomId) {
        gameRepository.removeQuiz(roomId);
    }

    public void initQuiz(Long roomId) {
        gameRepository.initQuizData(roomId);
    }
}
