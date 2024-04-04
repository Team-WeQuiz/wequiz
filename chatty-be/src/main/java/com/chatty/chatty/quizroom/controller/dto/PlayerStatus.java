package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record PlayerStatus(
        Long userId,
        Boolean isReady
) {

    public static PlayerStatus createStatus(Long userId) {
        return PlayerStatus.builder()
                .userId(userId)
                .isReady(false)
                .build();
    }
}