package com.chatty.chatty.game.domain;

import lombok.Builder;

@Builder
public record Answer(
        Long user_id,
        String user
) {
}
