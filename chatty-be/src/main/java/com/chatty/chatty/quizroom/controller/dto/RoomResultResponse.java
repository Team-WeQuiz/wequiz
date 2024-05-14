package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record RoomResultResponse(
        List<QuizResultDTO> results
) {

}
