package com.chatty.chatty.quizroom.controller.dto;

import lombok.Builder;

@Builder
public record MakeRoomResponse(

        Long roomId
) {

}
