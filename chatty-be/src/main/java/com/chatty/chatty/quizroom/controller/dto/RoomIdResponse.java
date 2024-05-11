package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record RoomIdResponse(
        Long roomId
) {

}
