package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record LobbyResponse(

        Long roomId,

        String name,

        Integer timeLimit,

        Integer playerLimitNum,

        String description
) {
}
