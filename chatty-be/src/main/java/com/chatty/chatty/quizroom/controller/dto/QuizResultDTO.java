package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record QuizResultDTO(
        Integer quizNumber,
        String quiz,
        List<String> options,
        String correct,
        List<PlayerAnswer> playerAnswers,
        Integer correctRate
) {
    @Builder
    public record PlayerAnswer(
            Long playerId,
            String nickname,
            String playerAnswer,
            Boolean marking
    ) {
    }
}
