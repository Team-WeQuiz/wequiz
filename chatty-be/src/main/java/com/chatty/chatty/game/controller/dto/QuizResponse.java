package com.chatty.chatty.game.controller.dto;

import com.chatty.chatty.game.controller.dto.dynamodb.Question;
import java.util.List;
import lombok.Builder;

@Builder
public record QuizResponse(
        List<Question> Quiz
) {
}
