package com.chatty.chatty.game.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record ScoreResponse(
        List<PlayerScoreDTO> scores
) {
}
