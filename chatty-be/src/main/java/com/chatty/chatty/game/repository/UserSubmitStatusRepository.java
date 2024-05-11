package com.chatty.chatty.game.repository;

import com.chatty.chatty.game.domain.UsersSubmitStatus;
import com.chatty.chatty.player.domain.PlayersStatus;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserSubmitStatusRepository {

    private static final Map<Long, UsersSubmitStatus> statuses = new ConcurrentHashMap<>();

    public void init(PlayersStatus players, Long roomId) {
        statuses.put(roomId, UsersSubmitStatus.init().addUsersInRoom(players));
    }

    public UsersSubmitStatus findByRoomId(Long roomId) {
        return statuses.get(roomId);
    }

    public UsersSubmitStatus submit(Long roomId, Long userId) {
        UsersSubmitStatus usersStatus = findByRoomId(roomId);
        return usersStatus.submit(userId);
    }

    public void clear(Long roomId) {
        statuses.remove(roomId);
    }
}
