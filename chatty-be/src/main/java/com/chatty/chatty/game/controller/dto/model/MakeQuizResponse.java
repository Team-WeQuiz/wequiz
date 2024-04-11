package com.chatty.chatty.game.controller.dto.model;

import lombok.Builder;

@Builder
public record MakeQuizResponse(

        Long roomId,

        Long quizDocId
) {
}
