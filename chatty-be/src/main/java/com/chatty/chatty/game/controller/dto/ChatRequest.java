package com.chatty.chatty.game.controller.dto;

public record ChatRequest(
        ChatType chatType,

        Long roomId,

        String message
) {

}
