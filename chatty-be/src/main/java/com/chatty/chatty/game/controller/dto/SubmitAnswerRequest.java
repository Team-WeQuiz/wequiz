package com.chatty.chatty.game.controller.dto;

public record SubmitAnswerRequest(
        Integer quizNum,

        Long playerId,

        String playerAnswer
) {
}
