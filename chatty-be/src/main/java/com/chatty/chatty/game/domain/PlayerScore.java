package com.chatty.chatty.game.domain;

import lombok.Getter;

@Getter
public class PlayerScore {
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
