package com.chatty.chatty.game.controller.dto.model;

import lombok.Builder;

@Builder
public record CreateQuizRequest(
        Long user_id,

        String timestamp,

        Integer num_of_quiz
) {

}
