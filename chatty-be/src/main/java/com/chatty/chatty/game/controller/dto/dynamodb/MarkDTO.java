package com.chatty.chatty.game.controller.dto.dynamodb;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MarkDTO(
        String id,

        @JsonProperty("correct_answer")
        String correct,

        List<Marked> markeds,

        @JsonProperty("quiz_num")
        Integer quizNumber
) {

    public record Marked(
            Boolean marking,

            @JsonProperty("user_answer")
            String playerAnswer,

            @JsonProperty("user_id")
            Long playerId
    ) {

    }
}
