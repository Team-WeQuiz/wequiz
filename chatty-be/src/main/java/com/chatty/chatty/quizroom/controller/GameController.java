package com.chatty.chatty.quizroom.controller;

import com.chatty.chatty.quizroom.controller.dto.ChatRequest;
import com.chatty.chatty.quizroom.controller.dto.ChatResponse;
import com.chatty.chatty.quizroom.domain.PlayersStatus;
import com.chatty.chatty.quizroom.service.GameService;
import java.time.LocalDateTime;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
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
                .chatType(request.chatType())
                .roomId(request.roomId())
                .userId(request.userId())
                .message(request.message())
                .time(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/rooms/{roomId}/join")
    @SendTo("/sub/rooms/{roomId}")
    public PlayersStatus joinRoom(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        return gameService.joinRoom(roomId, getUserIdFromHeader(headerAccessor));
    }

    private Long getUserIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        return (Long) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
    }
}
