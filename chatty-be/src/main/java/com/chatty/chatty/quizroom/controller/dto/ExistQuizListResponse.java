package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

public record ExistQuizListResponse(
        List<ExistQuiz> existQuizList
) {
    @Builder
    public record ExistQuiz(
            String quizDocId,
            String description,
            Integer numberOfQuiz
    ) {
    }
}
