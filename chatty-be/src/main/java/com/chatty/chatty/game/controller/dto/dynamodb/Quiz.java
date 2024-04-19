package com.chatty.chatty.game.controller.dto.dynamodb;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record Quiz(

        String id,

        @JsonProperty("question_number")
        Integer questionNumber,

        String type,

        String question,

        List<String> options,

        String answer
) {
}
