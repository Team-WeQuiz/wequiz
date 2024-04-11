package com.chatty.chatty.game.controller;

import com.chatty.chatty.game.controller.dto.ChatRequest;
import com.chatty.chatty.game.controller.dto.ChatResponse;
import com.chatty.chatty.game.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.game.service.GameService;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import java.time.LocalDateTime;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final SimpMessagingTemplate template;
    private final GameService gameService;
    private final DynamoDBService dynamoDBService;

    @MessageMapping("/rooms/{roomId}/chat")
    @SendTo("/sub/rooms/{roomId}/chat")
    public ChatResponse chat(
            @DestinationVariable Long roomId,
            SimpMessageHeaderAccessor headerAccessor,
            ChatRequest request
    ) {
        return ChatResponse.builder()
                .chatType(request.chatType())
                .roomId(request.roomId())
                .userId(getUserIdFromHeader(headerAccessor))
                .message(request.message())
                .time(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/rooms/{roomId}/join")
    @SendTo("/sub/rooms/{roomId}/status")
    public PlayersStatusDTO joinRoom(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        return gameService.joinRoom(roomId, getUserIdFromHeader(headerAccessor));
    }

    @MessageMapping("/rooms/{roomId}/leave")
    @SendTo("/sub/rooms/{roomId}/status")
    public PlayersStatusDTO leaveRoom(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        return gameService.leaveRoom(roomId, getUserIdFromHeader(headerAccessor));
    }

    @MessageMapping("/rooms/{roomId}/ready")
    @SendTo("/sub/rooms/{roomId}/status")
    public PlayersStatusDTO toggleReady(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        return gameService.toggleReady(roomId, getUserIdFromHeader(headerAccessor));
    }

    @DeleteMapping("/rooms/{roomId}/end")
    public ResponseEntity<Void> endGame(@PathVariable Long roomId) {
        gameService.endGame(roomId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    private Long getUserIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        return (Long) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
    }
}
