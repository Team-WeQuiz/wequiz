package com.chatty.chatty.game.controller.dto.model;

import java.util.List;
import lombok.Builder;

@Builder
public record CreateQuizRequest(
        Long user_id,

        String timestamp,

        Integer numOfQuiz,

        List<String> files
) {

}
