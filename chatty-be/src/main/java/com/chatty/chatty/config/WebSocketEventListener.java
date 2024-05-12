package com.chatty.chatty.config;

import com.chatty.chatty.game.service.GameService;
import com.chatty.chatty.player.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final GameService gameService;
    private final QuizRoomService quizRoomService;
    private final SimpMessagingTemplate template;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Long userId = (Long) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
        Long roomId = (Long) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("roomId");
        if (headerAccessor.getCommand() == StompCommand.DISCONNECT) {
            log.info("User {} disconnected from room {}", userId, roomId);
            PlayersStatusDTO playersStatusDTO = gameService.leaveRoom(roomId, userId);
            if (playersStatusDTO.playerStatuses().isEmpty()) {
                quizRoomService.finishRoom(roomId);
            }
            template.convertAndSend("/sub/rooms/" + roomId + "/status", playersStatusDTO);
            quizRoomService.broadcastUpdatedRoomList();
        }
    }
}