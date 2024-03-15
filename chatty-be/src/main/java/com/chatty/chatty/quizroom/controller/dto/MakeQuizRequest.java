package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record MakeQuizRequest(

        Long id,

        Long fileId,

        Integer numOfQuiz
) {

}
