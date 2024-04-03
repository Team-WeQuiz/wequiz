package com.chatty.chatty.quizroom.controller.dto;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

@Builder
@Slf4j
public record RoomUsersStatus(
        Long roomId,
        Set<RoomUserStatus> roomUserStatuses
) {

    public RoomUsersStatus join(Long userId) {
        Set<RoomUserStatus> newRoomUserStatuses = ConcurrentHashMap.newKeySet();
        newRoomUserStatuses.addAll(roomUserStatuses);
        newRoomUserStatuses.add(RoomUserStatus.createStatus(userId));
        return new RoomUsersStatus(roomId, newRoomUserStatuses);
    }
}
