package com.chatty.chatty.game.controller.dto;

import lombok.Builder;

@Builder
public record QuizReadyResponse(
        Boolean isReady
) {
}
