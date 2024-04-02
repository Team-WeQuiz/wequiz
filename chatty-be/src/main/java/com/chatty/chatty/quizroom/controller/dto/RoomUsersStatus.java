package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record RoomUsersStatus(
        Long roomId,
        List<RoomUserStatus> roomUserStatuses
) {

}
