package com.chatty.chatty.game.controller.dto;

public record ChatRequest(
        Long roomId,

        String message
) {

}
