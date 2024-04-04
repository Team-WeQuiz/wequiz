package com.chatty.chatty.quizroom.controller.dto;

public record ChatRequest(
        ChatType chatType,

        Long roomId,

        Long userId,

        String message
) {

}
