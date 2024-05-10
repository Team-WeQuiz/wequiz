package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.dynamodb.QuizDTO;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Builder
@Getter
@Slf4j
public class QuizData {

    private final Queue<QuizDTO> quizDTOQueue = new ConcurrentLinkedQueue<>();
    private final String quizDocId;
    private final String timestamp;
    private final Integer totalRound;
    private Integer currentRound;
    private Integer nextQuizNumber;

    public QuizDTO getQuiz() {
        return quizDTOQueue.peek();
    }

    public void fillQuiz(List<QuizDTO> quizDTOList) {
        quizDTOQueue.addAll(quizDTOList);
        this.currentRound++;
    }

    public void removeQuiz() {
        quizDTOQueue.poll();
    }

    public void increaseNextQuizNumber() {
        this.nextQuizNumber++;
    }
}
