package com.chatty.chatty.game.controller.dto;

import com.chatty.chatty.game.controller.dto.dynamodb.Quiz;
import lombok.Builder;

@Builder
public record QuizResponse(

        Integer totalRound,

        Integer currRound,

        Quiz quiz
) {
}
