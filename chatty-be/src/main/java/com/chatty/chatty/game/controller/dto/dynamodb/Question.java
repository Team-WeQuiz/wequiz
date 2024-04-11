package com.chatty.chatty.game.controller.dto.dynamodb;

import java.util.List;

public record Question(

        String id,

        Integer question_number,

        String type,

        String question,

        List<String> options,

        String answer
) {
}
