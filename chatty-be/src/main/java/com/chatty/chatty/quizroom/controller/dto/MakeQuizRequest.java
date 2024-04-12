package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record MakeQuizRequest(
        Long user_id,

        String timestamp,

        Integer numOfQuiz,

        List<String> files
) {

}
