package com.chatty.chatty.game.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record ScoreResponse(
        List<PlayerScore> scores
) {
    @Builder
    public record PlayerScore(
            Long playerId,
            Integer score
    ) {
    }
}
