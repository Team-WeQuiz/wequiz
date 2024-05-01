package com.chatty.chatty.game.domain;

import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AnswerData {
    private final List<Answer> playerAnswers = new ArrayList<>();
    private final Integer playerNum;
    private final Integer majorityNum;
    private final String quizId;
    private final Integer quizNum;
    private final String correct;

    public synchronized SubmitStatus addAnswer(Long playerId, String playerAnswer) {
        playerAnswers.add(Answer.builder()
                .user_id(playerId)
                .user(playerAnswer)
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
