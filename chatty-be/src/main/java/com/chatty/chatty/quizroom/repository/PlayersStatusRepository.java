package com.chatty.chatty.quizroom.repository;

import com.chatty.chatty.quizroom.domain.PlayersStatus;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PlayersStatusRepository {

    private static final Map<Long, PlayersStatus> playersStatusMap = new ConcurrentHashMap<>();

    public Optional<PlayersStatus> findByRoomId(Long roomId) {
        return Optional.ofNullable(playersStatusMap.get(roomId));
    }

    public PlayersStatus saveUserToRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = findByRoomId(roomId).orElse(PlayersStatus.init());
        updateStatus(roomId, playersStatus.updateWithNewUser(userId));
        return playersStatus;
    }

    public PlayersStatus leaveRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = findByRoomId(roomId).orElse(PlayersStatus.init());
        updateStatus(roomId, playersStatus.removeUser(userId));
        return playersStatus;
    }

    public PlayersStatus toggleReady(Long roomId, Long userId) {
        PlayersStatus playersStatus = findByRoomId(roomId).orElse(PlayersStatus.init());
        updateStatus(roomId, playersStatus.toggleReady(userId));
        return playersStatus;
    }

    private void updateStatus(Long roomId, PlayersStatus playersStatus) {
        playersStatusMap.put(roomId, playersStatus);
    }
}
