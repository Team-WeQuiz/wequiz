package com.chatty.chatty.quizroom.repository;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;

import com.chatty.chatty.quizroom.controller.dto.RoomUserStatus;
import com.chatty.chatty.quizroom.controller.dto.RoomUsersStatus;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RoomUsersStatusRepository {

    private static final List<RoomUsersStatus> roomUsersStatuses = new ArrayList<>();

    public RoomUsersStatus findByRoomId(Long roomId) {
        return roomUsersStatuses.stream()
                .filter(roomUsersStatus -> roomUsersStatus.roomId().equals(roomId))
                .findFirst()
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
    }

    public RoomUsersStatus addUserToRoom(Long roomId, Long userId) {
        RoomUsersStatus currentStatus = findByRoomId(roomId);
        RoomUserStatus newUser = RoomUserStatus.builder()
                .userId(userId)
                .isReady(false)
                .build();
        currentStatus.roomUserStatuses().add(newUser);
        return currentStatus;
    }
}
