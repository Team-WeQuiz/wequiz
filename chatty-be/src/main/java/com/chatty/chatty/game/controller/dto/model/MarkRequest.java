package com.chatty.chatty.game.controller.dto.model;

import java.util.List;
import lombok.Builder;

@Builder
public record MarkRequest(
        String id,
        String timestamp,
        String quiz_id,
        Integer quiz_num,
        String quiz_type,
        String correct_answer,
        List<AnswerDTO> submit_answers
) {

    @Builder
    public record AnswerDTO(
            Long user_id,
            String user_answer
    ) {

    }
}
