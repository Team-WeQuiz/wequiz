package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record RoomAbstractDTO(
        Long roomId,
        String name,
        String description,
        Integer currentPlayers,
        Integer maxPlayers
) {

}
