package com.chatty.chatty.game.controller.dto.model;

import java.util.List;

public record MarkResponse(
        String id,
        String quiz_id,
        List<Mark> answers
) {
    private record Mark(
            Integer user_id,
            String user,
            Boolean marking
    ) {
    }
}
