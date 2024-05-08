package com.chatty.chatty.user.controller.dto;

import lombok.Builder;

@Builder
public record ParticipatedQuizRoomResponse(
        Long roomId,
        String roomName,
        String roomDescription
) {

}
