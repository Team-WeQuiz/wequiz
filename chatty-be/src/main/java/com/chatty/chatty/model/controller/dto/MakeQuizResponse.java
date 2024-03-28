package com.chatty.chatty.model.controller.dto;

import lombok.Builder;

@Builder
public record MakeQuizResponse(

        Long id,

        Long quizDocId
) {
}
