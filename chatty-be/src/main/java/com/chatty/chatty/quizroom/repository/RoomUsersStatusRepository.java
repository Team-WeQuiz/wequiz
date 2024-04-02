package com.chatty.chatty.quizroom.repository;

import com.chatty.chatty.quizroom.controller.dto.RoomUserStatus;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class RoomUsersStatusRepository {

    private static final Map<Long, RoomUserStatus> roomUsersStatus = new ConcurrentHashMap<>();

    public void addUserToRoom(Long roomId, Long userId) {
        RoomUserStatus roomUserStatus = RoomUserStatus.builder()
                .userId(userId)
                .build();
        roomUsersStatus.put(roomId, roomUserStatus);
    }
}
