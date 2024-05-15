package com.chatty.chatty.game.controller.dto.model;

import java.util.List;
import lombok.Builder;

@Builder
public record MarkRequest(
        String id,
        String timestamp,
        String quiz_id,
        Integer question_number,
        String correct,
        List<AnswerDTO> answers
) {

    @Builder
    public record AnswerDTO(
            Long user_id,
            String user
    ) {

    }
}
