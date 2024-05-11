package com.chatty.chatty.player.repository;

import com.chatty.chatty.player.domain.PlayersStatus;
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

    public PlayersStatus saveUserToRoom(Long roomId, Long userId, String nickname, String profileImageUrl) {
        PlayersStatus playersStatus = findByRoomId(roomId).orElse(PlayersStatus.init());
        updateStatus(roomId, playersStatus.updateWithNewUser(userId, nickname, profileImageUrl));
        return playersStatus;
    }

    public PlayersStatus leaveRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = findByRoomId(roomId).get();
        updateStatus(roomId, playersStatus.removeUser(userId));
        return playersStatus;
    }

    public PlayersStatus toggleReady(Long roomId, Long userId) {
        PlayersStatus playersStatus = findByRoomId(roomId).get();
        updateStatus(roomId, playersStatus.toggleReady(userId));
        return playersStatus;
    }

    public void clear(Long roomId) {
        playersStatusMap.remove(roomId);
    }

    public Integer countPlayers(Long roomId) {
        return findByRoomId(roomId)
                .map(status -> status.playerStatusSet().size())
                .orElse(0);
    }

    private void updateStatus(Long roomId, PlayersStatus playersStatus) {
        playersStatusMap.put(roomId, playersStatus);
    }
}
