package com.chatty.chatty.game.controller.dto.dynamodb;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MarkDTO(
        String id,

        String correct,

        List<Marked> markeds,

        @JsonProperty("question_number")
        Integer quizNumber
) {
    public record Marked(
            Boolean marking,

            @JsonProperty("user")
            String playerAnswer,

            @JsonProperty("user_id")
            Long playerId
    ) {
    }
}
