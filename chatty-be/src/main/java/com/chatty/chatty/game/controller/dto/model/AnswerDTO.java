package com.chatty.chatty.game.controller.dto.model;

import lombok.Builder;

@Builder
public record AnswerDTO(
        Long user_id,
        String user
) {
}
