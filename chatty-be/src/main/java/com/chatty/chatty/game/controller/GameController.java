package com.chatty.chatty.game.controller;

import com.chatty.chatty.game.controller.dto.ChatRequest;
import com.chatty.chatty.game.controller.dto.ChatResponse;
import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
import com.chatty.chatty.game.controller.dto.SubmitAnswerResponse;
import com.chatty.chatty.game.service.GameService;
import com.chatty.chatty.player.controller.dto.NicknameRequest;
import com.chatty.chatty.player.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import java.time.LocalDateTime;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameService gameService;
    private final QuizRoomService quizRoomService;
    private final SimpMessagingTemplate template;

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
    public PlayersStatusDTO joinRoom(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor,
            NicknameRequest request) {
        quizRoomService.broadcastUpdatedRoomList();
        return gameService.joinRoom(roomId, getUserIdFromHeader(headerAccessor), request);
    }

    @MessageMapping("/rooms/{roomId}/leave")
    @SendTo("/sub/rooms/{roomId}/status")
    public PlayersStatusDTO leaveRoom(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        quizRoomService.broadcastUpdatedRoomList();
        return gameService.leaveRoom(roomId, getUserIdFromHeader(headerAccessor));
    }

    @MessageMapping("/rooms/{roomId}/ready")
    @SendTo("/sub/rooms/{roomId}/status")
    public PlayersStatusDTO toggleReady(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        return gameService.toggleReady(roomId, getUserIdFromHeader(headerAccessor));
    }

    /*
    publication URL : /pub/rooms/{roomId}/quiz
    subscription URL : /user/{userId}/queue/rooms/{roodId}/quiz
     */
    @MessageMapping("/rooms/{roomId}/quiz")
    public void sendQuiz(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        QuizResponse quizResponse = gameService.sendQuiz(roomId);
        template.convertAndSendToUser(
                getUserIdFromHeader(headerAccessor).toString(),
                "/queue/rooms/" + roomId + "/quiz",
                quizResponse
        );
    }

    @MessageMapping("/rooms/{roomId}/submit")
    @SendTo("/sub/rooms/{roomId}/submit")
    public SubmitAnswerResponse submitAnswer(@DestinationVariable Long roomId, SubmitAnswerRequest request,
            SimpMessageHeaderAccessor headerAccessor) {
        return gameService.addPlayerAnswer(roomId, request, getUserIdFromHeader(headerAccessor));
    }

    private Long getUserIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        return (Long) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
    }
}
