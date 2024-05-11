package com.chatty.chatty.game.domain;

public enum Phase {
    QUIZ_SOLVING,
    COUNTDOWN,
    RESULT;

    public static Phase init() {
        return QUIZ_SOLVING;
    }
}
