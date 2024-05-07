package com.chatty.chatty.game.controller.dto;

import lombok.Builder;

@Builder
public record PlayerScoreDTO(
        Long playerId,
        String nickname,
        Integer score
) {
}