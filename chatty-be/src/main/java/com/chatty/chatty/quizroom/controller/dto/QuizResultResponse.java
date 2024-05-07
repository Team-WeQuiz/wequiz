package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;

public record QuizResultResponse(
        String quiz,
        String correct,
        List<PlayerAnswer> playerAnswers,
        Integer correctRate
) {
    public record PlayerAnswer(
            Long playerId,
            String nickname,
            String playerAnswer,
            Boolean marking
    ) {
    }
}
