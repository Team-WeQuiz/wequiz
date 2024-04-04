package com.chatty.chatty.quizroom.repository;

import com.chatty.chatty.quizroom.controller.dto.RoomUserStatus;
import com.chatty.chatty.quizroom.domain.RoomUsersStatus;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j
public class RoomUsersStatusRepository {

    private static final Map<Long, RoomUsersStatus> roomUsersStatuses = new ConcurrentHashMap<>();

    public RoomUsersStatus findByRoomId(Long roomId) {
        return roomUsersStatuses.get(roomId);
    }

    public RoomUsersStatus addUserToRoom(Long roomId, Long userId) {
        return roomUsersStatuses.computeIfPresent(
                roomId, (id, existingStatus) -> existingStatus.join(userId)
        );
    }

    public void initializeRoomWithManager(Long roomId, Long roomManagerId) {
        RoomUsersStatus newStatus = RoomUsersStatus.builder()
                .roomId(roomId)
                .roomUserStatuses(Set.of(RoomUserStatus.createStatus(roomManagerId)))
                .build();
        roomUsersStatuses.put(roomId, newStatus);
    }
}
