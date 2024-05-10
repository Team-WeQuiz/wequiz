package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Builder
@Getter
@Slf4j
public class AnswerData {
    @Builder
    public record PlayerAnswerData(
            String playerAnswer,
            LocalDateTime submittedTime
    ) {
    }

    private final Map<Long, PlayerAnswerData> playerAnswers = new ConcurrentHashMap<>();
    private final Integer playerNum;
    private final Integer majorityNum;
    private final String quizId;
    private final Integer quizNum;
    private final String correct;
    private final LocalDateTime startedTime;

    public Boolean addAnswer(Long userId, SubmitAnswerRequest request) {
        playerAnswers.put(userId, PlayerAnswerData.builder()
                .playerAnswer(request.playerAnswer())
                .submittedTime(LocalDateTime.now())
                .build());
        return checkSubmitStatus();
    }

    private Boolean checkSubmitStatus() {
        int submitCount = playerAnswers.size();
        log.info("submitCount: {}", submitCount);
        log.info("playerAnswers.size(): {}", playerAnswers.size());
        log.info("playerNum: {}", playerNum);
        log.info("majorityNum: {}", majorityNum);
        if (submitCount >= majorityNum) {
            log.info("MAJORITY Submitted");
            return true;
        }
        return false;
    }
}
