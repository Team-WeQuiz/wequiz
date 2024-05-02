package com.chatty.chatty.game.controller.dto;

import java.time.LocalDateTime;

public record SubmitAnswerRequest(
        Integer quizNum,

        String playerAnswer,

        LocalDateTime submittedTime
) {

}
