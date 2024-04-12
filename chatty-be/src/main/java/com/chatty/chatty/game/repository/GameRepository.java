package com.chatty.chatty.game.repository;

import com.chatty.chatty.game.controller.dto.dynamodb.Question;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.time.format.DateTimeFormatter;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GameRepository {

    private final QuizRoomRepository quizRoomRepository;
    private final DynamoDBService dynamoDBService;

    private static final Queue<Question> quizQueue = new LinkedList<>();

    private void getQuizFromDB(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId).orElseThrow();
        Long quizDocId = quizRoom.getQuizDocId();
        String timestamp = quizRoom.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        //List<Question> questions = dynamoDBService.getQuizFromDB(quizDocId, timestamp);
        List<Question> questions = dynamoDBService.getQuizFromDB(roomId.toString(), timestamp);
        // TODO: 문제가 아직 업로드 되지 않았을 경우
//        if (questions.isEmpty()) {
//        }
        // TODO: query로 필요한 5문제만 가져오기
        quizQueue.addAll(questions);
    }

    public Question sendQuiz(Long roomId) {
        if (!quizQueue.isEmpty()) {

            quizQueue.poll();
        }
        if (quizQueue.isEmpty()) {
            getQuizFromDB(roomId);
        }

        return quizQueue.peek();
    }
}
