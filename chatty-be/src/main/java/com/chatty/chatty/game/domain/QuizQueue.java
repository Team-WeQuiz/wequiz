package com.chatty.chatty.game.domain;

import com.chatty.chatty.game.controller.dto.dynamodb.Question;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.time.format.DateTimeFormatter;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import lombok.Builder;

@Builder
public record QuizQueue(
        Queue<Question> quizQueue,
        QuizRoomRepository quizRoomRepository,
        DynamoDBService dynamoDBService
) {
    private static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public static QuizQueue init() {
        return QuizQueue.builder()
                .quizQueue(new LinkedList<>())
                .build();
    }

    public Question sendQuiz() {
        return quizQueue.peek();
    }

    public void removeAndFillQuiz(Long roomId) {
        quizQueue.poll();
        if (quizQueue.isEmpty()) {
            fillQuiz(roomId);
        }
    }

    public void fillQuiz(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId).orElseThrow();
        String quizDocId = quizRoom.getQuizDocId();
        String timestamp = quizRoom.getCreatedAt().format(DateTimeFormatter.ofPattern(DATETIME_FORMAT));
        // TODO: quizDocId, timestamp도 메모리에 담기

        // 폴링
        List<Question> questions = dynamoDBService.getQuizFromDB(quizDocId, timestamp);
        // TODO: 문제가 아직 업로드 되지 않았을 경우 폴링
//        if (questions.isEmpty()) {
//        }
        // TODO: query로 필요한 5문제만 가져오기
        quizQueue.addAll(questions);
    }
}
