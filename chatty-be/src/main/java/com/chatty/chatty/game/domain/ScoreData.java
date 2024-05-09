package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.model.MarkResponse.Mark;
import com.chatty.chatty.player.domain.PlayerStatus;
import com.chatty.chatty.player.domain.PlayersStatus;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Getter;

@Getter
public class ScoreData {
    @Getter
    public static class PlayerScore {
        private final String nickname;
        private Integer score;

        public PlayerScore(String nickname, Integer score) {
            this.nickname = nickname;
            this.score = score;
        }

        public void updateScore(Integer newScore) {
            this.score += newScore;
        }
    }

    private static final Integer SCORE_PER_PLAYER = 100;
    private final Map<Long, PlayerScore> playersScore = new ConcurrentHashMap<>();

    public ScoreData(PlayersStatus playersStatus) {
        Set<PlayerStatus> statusSet = playersStatus.playerStatusSet();
        for (PlayerStatus status : statusSet) {
            this.playersScore.put(status.userId(), new PlayerScore(status.nickname(), 0));
        }
    }

    public void addScore(AnswerData answerData, List<Mark> markList) {
        int totalScore = SCORE_PER_PLAYER * answerData.getPlayerNum();
        int correctPlayersNum = countCorrectPlayers(markList);
        int defaultScore = (correctPlayersNum == 0) ? 0 : totalScore / correctPlayersNum;

        markList.forEach(mark -> {
            if (mark.marking()) {
                LocalDateTime submittedTime = answerData.getPlayerAnswers().get(mark.user_id()).submittedTime();
                int newScore = defaultScore - calculateSolvingTime(answerData.getStartedTime(), submittedTime);
                newScore = Math.max(1, Math.min(totalScore / 2, newScore));

                PlayerScore playerScore = playersScore.get(mark.user_id());
                playerScore.updateScore(newScore);
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
