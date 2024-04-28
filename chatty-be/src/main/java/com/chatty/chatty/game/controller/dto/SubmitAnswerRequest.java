package com.chatty.chatty.game.controller.dto;

public record SubmitAnswerRequest(
        String quizId,

        Integer quizNum,

        String answer,

        Long playerId,

        String playerAnswer
) {
}
