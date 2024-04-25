package com.chatty.chatty.game.controller.dto.model;

import com.chatty.chatty.game.domain.Answer;
import java.util.List;
import lombok.Builder;

@Builder
public record MarkRequest(
        String id,
        String quiz_id,
        Integer question_number,
        String correct,
        List<Answer> answers
) {
}
