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

    private static final Map<Long, PlayersStatus> roomUsersStatuses = new ConcurrentHashMap<>();

    public Optional<PlayersStatus> findByRoomId(Long roomId) {
        return Optional.ofNullable(roomUsersStatuses.get(roomId));
    }

    public PlayersStatus saveUserToRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = findByRoomId(roomId).orElse(PlayersStatus.init());
        roomUsersStatuses.put(roomId, playersStatus.updateWithNewUser(userId));
        return playersStatus;
    }
}
