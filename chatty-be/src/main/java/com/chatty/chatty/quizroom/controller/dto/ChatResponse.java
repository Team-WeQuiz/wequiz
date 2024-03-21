package com.chatty.chatty.quizroom.controller.dto;

import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record ChatResponse(

        Long roomId,

        Long userId,

        String message,

        LocalDateTime time

) {
}
