package com.chatty.chatty.player.domain;

import java.util.Objects;
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

    public PlayerStatus toggleReady() {
        return new PlayerStatus(userId, !isReady);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PlayerStatus that = (PlayerStatus) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }
}