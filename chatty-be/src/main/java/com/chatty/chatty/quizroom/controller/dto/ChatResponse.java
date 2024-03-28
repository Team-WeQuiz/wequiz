package com.chatty.chatty.quizroom.controller.dto;

import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public class ChatResponse {

    private ChatType chatType;

    private Long roomId;

    private Long userId;

    private String message;

    private LocalDateTime time;

}