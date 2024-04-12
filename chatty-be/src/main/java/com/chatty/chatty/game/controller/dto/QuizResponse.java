package com.chatty.chatty.game.controller.dto;

import com.chatty.chatty.game.controller.dto.dynamodb.Question;
import lombok.Builder;

@Builder
public record QuizResponse(
        Question Quiz
) {
}
