package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record RoomAbstractResponse(
        Long roomId,
        String name,
        String description,
        Integer currentPlayers,
        Integer maxPlayers
) {

}
