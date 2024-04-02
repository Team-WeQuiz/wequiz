package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record RoomUserStatus(
        Long userId,
        Boolean isReady
) {

    public RoomUserStatus {
        if (isReady == null) {
            isReady = false;
        }
    }
}