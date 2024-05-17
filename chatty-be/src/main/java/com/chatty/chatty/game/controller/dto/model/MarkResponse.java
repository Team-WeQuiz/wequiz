package com.chatty.chatty.game.controller.dto.model;

import java.util.List;

public record MarkResponse(
        String id,
        String quiz_id,
        List<Mark> marked_answers
) {

    public record Mark(
            Long user_id,
            String user_answer,
            Boolean marking
    ) {

    }
}
