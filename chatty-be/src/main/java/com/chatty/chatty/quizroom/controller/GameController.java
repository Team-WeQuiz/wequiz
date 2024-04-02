package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.quizroom.controller.dto.ChatRequest;
import com.chatty.chatty.quizroom.controller.dto.ChatResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomUsersStatusResponse;
import com.chatty.chatty.quizroom.service.SocketService;
import java.security.Principal;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SocketController {

    private final SocketService socketService;

    @MessageMapping("/rooms/{roomId}/chat")
    @SendTo("/sub/rooms/{roomId}")
    public ChatResponse chat(@DestinationVariable Long roomId, ChatRequest request) {
        return ChatResponse.builder()
                .chatType(request.getChatType())
                .roomId(request.getRoomId())
                .userId(request.getUserId())
                .message(request.getMessage())
                .time(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/rooms/{roomId}/join")
    @SendTo("/sub/rooms/{roomId}")
    public RoomUsersStatusResponse join(@DestinationVariable Long roomId, Principal principal) {
        String userId = principal.getName();
        return socketService.join(roomId, principal);
    }
}
