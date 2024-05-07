package com.chatty.chatty.player.domain.entity;

import lombok.Builder;

@Builder
public record MarkedAnswer(
        String playerAnswer,
        Boolean marking
) {
}
