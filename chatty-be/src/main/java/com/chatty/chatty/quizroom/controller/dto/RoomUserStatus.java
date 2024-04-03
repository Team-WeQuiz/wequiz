package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record RoomUserStatus(
        Long userId,
        Boolean isReady
) {

    public static RoomUserStatus createStatus(Long userId) {
        return RoomUserStatus.builder()
                .userId(userId)
                .isReady(false)
                .build();
    }
}