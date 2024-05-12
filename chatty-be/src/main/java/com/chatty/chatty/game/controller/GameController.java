package com.chatty.chatty.game.controller;

import com.chatty.chatty.game.controller.dto.ChatRequest;
import com.chatty.chatty.game.controller.dto.ChatResponse;
import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.controller.dto.ScoreResponse;
import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
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
        headerAccessor.getSessionAttributes().put("roomId", roomId);
        PlayersStatusDTO response = gameService.joinRoom(roomId, getUserIdFromHeader(headerAccessor), request);
        quizRoomService.broadcastUpdatedRoomList();
        return response;
    }

    @MessageMapping("/rooms/{roomId}/ready")
    @SendTo("/sub/rooms/{roomId}/status")
    public PlayersStatusDTO toggleReady(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        return gameService.toggleReady(roomId, getUserIdFromHeader(headerAccessor));
    }

    /*
    publication URL : /pub/rooms/{roomId}/quiz
    subscription URL : /user/{userId}/queue/rooms/{roomId}/quiz
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
    public void submitAnswer(@DestinationVariable Long roomId, SubmitAnswerRequest request,
            SimpMessageHeaderAccessor headerAccessor) {
        log.info("Submit request: {}", request);
        log.info("Submit userId: {}", getUserIdFromHeader(headerAccessor));
        gameService.addPlayerAnswer(roomId, request, getUserIdFromHeader(headerAccessor));
    }

    /*
    publication URL : /pub/rooms/{roomId}/score
    subscription URL : /user/{userId}/queue/rooms/{roomId}/score
     */
    @MessageMapping("/rooms/{roomId}/score")
    public void sendScore(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        ScoreResponse scoreResponse = gameService.sendScore(roomId);
        template.convertAndSendToUser(
                getUserIdFromHeader(headerAccessor).toString(),
                "/queue/rooms/" + roomId + "/score",
                scoreResponse
        );
    }

    @MessageMapping("/rooms/{roomId}/phase")
    @SendTo("/sub/rooms/{roomId}/phase")
    public void getPhase(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        gameService.getPhase(roomId, getUserIdFromHeader(headerAccessor));
    }

    private Long getUserIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        return (Long) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
    }
}
