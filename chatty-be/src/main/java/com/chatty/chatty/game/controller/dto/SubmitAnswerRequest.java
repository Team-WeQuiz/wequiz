package com.chatty.chatty.game.controller.dto;

public record SubmitAnswerRequest(
        Integer quizNumber,

        String playerAnswer
) {
}
