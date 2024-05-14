package com.chatty.chatty.config;

import static java.lang.String.format;

import com.chatty.chatty.game.controller.dto.CountDownResponse;
import com.chatty.chatty.game.controller.dto.DescriptionResponse;
import com.chatty.chatty.game.controller.dto.QuizReadyResponse;
import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.controller.dto.ScoreResponse;
import com.chatty.chatty.game.controller.dto.SubmitAnswerResponse;
import com.chatty.chatty.player.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.quizroom.controller.dto.RoomListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GlobalMessagingTemplate {

    private static final String PLAYERS_STATUS_DESTINATION = "/sub/rooms/%d/status";
    private static final String QUIZ_COUNT_DESTINATION = "/sub/rooms/%d/quizCount";
    private static final String SCORE_COUNT_DESTINATION = "/sub/rooms/%d/scoreCount";
    private static final String SUBMIT_STATUS_DESTINATION = "/sub/rooms/%d/submit";
    private static final String USER_DESCRIPTION_DESTINATION = "/queue/rooms/%d/description";
    private static final String USER_QUIZ_DESTINATION = "/queue/rooms/%d/quiz";
    private static final String USER_QUIZ_READY_DESTINATION = "/queue/rooms/%d/quizReady";
    private static final String SCORE_DESTINATION = "/sub/rooms/%d/score";
    private static final String ROOM_LIST_DESTINATION = "/sub/rooms?page=%d";

    private final SimpMessagingTemplate template;

    public void publishPlayersStatus(Long roomId, PlayersStatusDTO response) {
        template.convertAndSend(format(PLAYERS_STATUS_DESTINATION, roomId), response);
    }

    public void publishQuizCount(Long roomId, CountDownResponse response) {
        template.convertAndSend(format(QUIZ_COUNT_DESTINATION, roomId), response);
    }

    public void publishScoreCount(Long roomId, CountDownResponse response) {
        template.convertAndSend(format(SCORE_COUNT_DESTINATION, roomId), response);
    }

    public void publishSubmitStatus(Long roomId, SubmitAnswerResponse response) {
        template.convertAndSend(format(SUBMIT_STATUS_DESTINATION, roomId), response);
    }

    public void publishRoomList(Integer page, RoomListResponse response) {
        template.convertAndSend(format(ROOM_LIST_DESTINATION, page), response);
    }

    public void publishScore(Long roomId, ScoreResponse response) {
        template.convertAndSend(
                format(SCORE_DESTINATION, roomId),
                response
        );
    }

    public void publishDescription(Long roomId, Long userId, DescriptionResponse response) {
        template.convertAndSendToUser(
                userId.toString(),
                format(USER_DESCRIPTION_DESTINATION, roomId),
                response
        );
    }

    public void publishQuiz(Long userId, Long roomId, QuizResponse response) {
        template.convertAndSendToUser(
                userId.toString(),
                format(USER_QUIZ_DESTINATION, roomId),
                response
        );
    }

    public void publishQuizReady(Long userId, Long roomId, QuizReadyResponse response) {
        template.convertAndSendToUser(
                userId.toString(),
                format(USER_QUIZ_READY_DESTINATION, roomId),
                response
        );
    }
}
