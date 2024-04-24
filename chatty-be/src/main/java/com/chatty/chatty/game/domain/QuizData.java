package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.dynamodb.Quiz;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Builder
@Getter
@Slf4j
public class QuizData {

    private final Queue<Quiz> quizQueue = new ConcurrentLinkedQueue<>();
    private final String quizDocId;
    private final String timestamp;
    private final Integer totalRound;
    private Integer currentRound;
}
