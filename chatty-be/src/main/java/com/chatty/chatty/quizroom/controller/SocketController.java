package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.quizroom.controller.dto.ChatRequest;
import com.chatty.chatty.quizroom.controller.dto.ChatResponse;
import com.chatty.chatty.quizroom.service.SocketService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SocketController {

    private final SocketService socketService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/rooms/{roomId}/chat")
    @SendTo("/sub/rooms/{roomId}")
    public ChatResponse chat(@DestinationVariable Long roomId, ChatRequest request) {
        return ChatResponse.builder()
                .roomId(roomId)
                .userId(request.getUserId())
                .message(request.getMessage())
                .time(LocalDateTime.now())
                .build();
    }
}
