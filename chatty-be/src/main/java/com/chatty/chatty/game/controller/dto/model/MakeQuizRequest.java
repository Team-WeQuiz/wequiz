package com.chatty.chatty.game.controller.dto.model;

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
