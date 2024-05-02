package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AnswerData {
    private final Map<Long, PlayerAnswerData> playerAnswers = new ConcurrentHashMap<>();
    private final Integer playerNum;
    private final Integer majorityNum;
    private final String quizId;
    private final Integer quizNum;
    private final String correct;
    private final LocalDateTime startedTime;

    public synchronized SubmitStatus addAnswer(SubmitAnswerRequest request) {
        playerAnswers.put(request.playerId(), PlayerAnswerData.builder()
                .playerAnswer(request.playerAnswer())
                .submittedTime(request.submittedTime())
                .build());
        return checkSubmitStatus();
    }

    private SubmitStatus checkSubmitStatus() {
        int submitCount = playerAnswers.size();

        if (submitCount == playerNum) {
            return SubmitStatus.ALL_SUBMITTED;
        } else if (submitCount == majorityNum) {
            return SubmitStatus.MAJORITY_SUBMITTED;
        }
        return SubmitStatus.PARTIAL_SUBMITTED;
    }
}
