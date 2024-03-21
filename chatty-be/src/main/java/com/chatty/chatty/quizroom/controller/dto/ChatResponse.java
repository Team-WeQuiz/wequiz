package com.chatty.chatty.quizroom.controller.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ChatResponse {

    private ChatType chatType;

    private Long roomId;

    private Long userId;

    private String message;

    private LocalDateTime time;

}