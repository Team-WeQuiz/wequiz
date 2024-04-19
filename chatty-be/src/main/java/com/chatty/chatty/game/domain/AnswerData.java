package com.chatty.chatty.game.domain;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AnswerData {
    private final Map<Long, Object> playerAnswers = new ConcurrentHashMap<>();
    private final Integer playerNum;  // 전체 인원수
    private final Integer majorityNum;  // 과반수
    private final Integer quizNum;  // 문제 번호
    private final Object quizAnswer;  // 정답

    public void addAnswer(Long playerId, Object playerAnswer) {
        playerAnswers.put(playerId, playerAnswer);
    }

    public void countSubmittedPlayer() {
        int submitCount = playerAnswers.size();
        if (submitCount == playerNum) {
            // 전체 제출
            // 문제큐 초기화
            // 채점요청
            // 점수계산?
            // 답안큐 초기화
        }
        if (submitCount == majorityNum) {
            // 과반수일 때
            // 과반수라고 클라에 전달
        }
    }
}
