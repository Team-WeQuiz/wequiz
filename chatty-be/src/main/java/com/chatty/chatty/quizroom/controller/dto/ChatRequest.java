package com.chatty.chatty.quizroom.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ChatRequest {

    private ChatType chatType;

    private Long roomId;

    private Long userId;

    private String message;

}
