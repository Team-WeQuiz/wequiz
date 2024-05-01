package com.chatty.chatty.game.domain;

import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record PlayerAnswerData(
        String playerAnswer,

        LocalDateTime submittedTime
) {
}
