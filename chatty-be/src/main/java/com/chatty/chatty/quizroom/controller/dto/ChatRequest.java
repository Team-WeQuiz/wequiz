package com.chatty.chatty.quizroom.controller.dto;

import lombok.Getter;

@Getter
public class ChatRequest {

    private ChatType chatType;

    private Long roomId;

    private Long userId;

    private String message;

}
