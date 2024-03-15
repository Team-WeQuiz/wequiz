package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record MakeRoomResponse(

        Long id,

        String link,

        List<String> quiz,

        String description
) {

}
