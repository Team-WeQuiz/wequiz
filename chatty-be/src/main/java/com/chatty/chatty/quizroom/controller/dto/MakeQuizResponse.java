package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record MakeQuizResponse(

        Long id,

        List<?> questions,

        String description
) {
}
