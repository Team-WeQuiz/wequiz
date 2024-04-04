package com.chatty.chatty.quizroom.domain;

import lombok.Builder;

@Builder
public record PlayerStatus(
        Long userId,
        Boolean isReady
) {

    private static final Boolean DEFAULT_READY_STATUS = false;

    public static PlayerStatus initNewUser(Long userId) {
        return PlayerStatus.builder()
                .userId(userId)
                .isReady(DEFAULT_READY_STATUS)
                .build();
    }
}