package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.quizroom.controller.dto.ChatRequest;
import com.chatty.chatty.quizroom.controller.dto.ChatResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomUsersStatus;
import com.chatty.chatty.quizroom.service.GameService;
import java.security.Principal;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameService gameService;

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
    public RoomUsersStatus join(@DestinationVariable Long roomId, Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        return gameService.join(roomId, userId);
    }
}
