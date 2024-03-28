package com.chatty.chatty.model.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record MakeQuizRequest(

        Long roomId,

        Integer numOfQuiz,

        String type,

        List<String> files

) {

}
