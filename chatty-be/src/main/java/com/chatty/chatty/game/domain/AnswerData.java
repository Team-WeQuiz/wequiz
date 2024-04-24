package com.chatty.chatty.game.domain;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AnswerData {
    private final Map<Long, String> playerAnswers = new ConcurrentHashMap<>();
    private final Integer playerNum;
    private final Integer majorityNum;
    private final Integer quizNum;
    private final String correct;

    public synchronized SubmitStatus addAnswer(Long playerId, String playerAnswer) {
        playerAnswers.put(playerId, playerAnswer);
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
