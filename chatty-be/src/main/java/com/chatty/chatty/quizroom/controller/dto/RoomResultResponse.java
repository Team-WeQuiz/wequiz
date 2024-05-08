package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;

public record RoomResultResponse(
        List<QuizResult> results
) {
    public record QuizResult(
            Integer quizNumber,
            String quiz,
            List<String> options,
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
}

