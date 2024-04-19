package com.chatty.chatty.game.controller.dto;

public record PlayerAnswerRequest(
        Integer quizNum,

        Object quizAnswer,

        Long playerId,

        Object playerAnswer
) {
}
