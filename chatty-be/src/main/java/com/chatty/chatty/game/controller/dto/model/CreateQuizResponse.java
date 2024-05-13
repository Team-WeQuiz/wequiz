package com.chatty.chatty.game.controller.dto.model;

import lombok.Builder;

@Builder
public record CreateQuizResponse(

        Long roomId,

        Long quizDocId
) {

}
