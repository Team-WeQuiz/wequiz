package com.chatty.chatty.game.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record QuizResponse(

        Integer totalRound,

        Integer currentRound,

        Integer quizNumber,

        String type,

        String quiz,

        List<String> options
) {

}
