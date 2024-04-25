package com.chatty.chatty.game.controller.dto;

import com.chatty.chatty.game.domain.SubmitStatus;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record SubmitAnswerResponse(
        SubmitStatus status,

        LocalDateTime timestamp
) {
}
