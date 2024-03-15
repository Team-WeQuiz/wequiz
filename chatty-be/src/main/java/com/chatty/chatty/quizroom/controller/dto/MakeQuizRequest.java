package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record MakeQuizRequest(

        Long id,

        Integer numOfQuiz,

        String type,

        List<String> files

) {

}
