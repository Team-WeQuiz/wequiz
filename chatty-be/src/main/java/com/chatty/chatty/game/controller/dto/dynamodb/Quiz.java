package com.chatty.chatty.game.controller.dto.dynamodb;

import com.fasterxml.jackson.annotation.JsonSetter;
import java.util.List;

public record Quiz(

        String id,

        @JsonSetter("question_number")
        Integer questionNumber,

        String type,

        String question,

        List<String> options,

        String answer
) {
}
