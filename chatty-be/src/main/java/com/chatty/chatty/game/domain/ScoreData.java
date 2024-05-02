package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.model.MarkResponse.Mark;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ScoreData {
    private static final Integer SCORE_PER_PLAYER = 100;
    private static final Integer ZERO = 0;
    private final Map<Long, Integer> playerScores = new ConcurrentHashMap<>();

    public void addScore(AnswerData answerData, List<Mark> markList) {
        int totalScore = SCORE_PER_PLAYER * answerData.getPlayerNum();
        int correctPlayersNum = countCorrectPlayers(markList);
        if (correctPlayersNum == 0) {
            return;
        }
        int defaultScore = totalScore / correctPlayersNum;

        markList.forEach(mark -> {
            int currentScore = playerScores.computeIfAbsent(mark.user_id(), k -> ZERO);
            if (mark.marking()) {
                LocalDateTime submittedTime = answerData.getPlayerAnswers().get(mark.user_id()).submittedTime();
                int newScore = defaultScore - calculateSolvingTime(answerData.getStartedTime(), submittedTime);
                int updatedScore = Math.max(1, Math.min(totalScore / 2, currentScore + newScore));
                playerScores.put(mark.user_id(), updatedScore);
            }
        });
    }

    private Integer countCorrectPlayers(List<Mark> answers) {
        return Math.toIntExact(answers.stream()
                .filter(Mark::marking)
                .count());
    }

    private Integer calculateSolvingTime(LocalDateTime startedTime, LocalDateTime submittedTime) {
        return Math.toIntExact(Duration.between(startedTime, submittedTime).getSeconds());
    }
}
