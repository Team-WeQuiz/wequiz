package com.chatty.chatty.quizroom.repository;

import com.chatty.chatty.quizroom.domain.PlayerStatus;
import com.chatty.chatty.quizroom.domain.PlayersStatus;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class RoomUsersStatusRepository {

    private static final Map<Long, PlayersStatus> roomUsersStatuses = new ConcurrentHashMap<>();

    public Optional<PlayersStatus> findByRoomId(Long roomId) {
        return roomUsersStatuses.get(roomId);
    }

    public PlayersStatus addUserToRoom(Long roomId, Long userId) {

    }

    public PlayersStatus initRoom(Long roomId) {
        return PlayersStatus.builder()
                .playerStatuses(Set.of())
                .build();
    }
}
