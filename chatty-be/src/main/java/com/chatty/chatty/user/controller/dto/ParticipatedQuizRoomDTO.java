package com.chatty.chatty.user.controller.dto;

import lombok.Builder;

@Builder
public record ParticipatedQuizRoomDTO(
        Long roomId,
        String name,
        String description
) {

}
