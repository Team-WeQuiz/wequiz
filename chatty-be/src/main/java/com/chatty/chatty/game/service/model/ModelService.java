package com.chatty.chatty.game.service.model;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import com.chatty.chatty.game.controller.dto.model.CreateQuizRequest;
import com.chatty.chatty.quizroom.controller.dto.QuizDocIdMLResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class ModelService {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Value("${url.ml}")
    private String ML_URL;

    private final RestClient restClient;

    public QuizDocIdMLResponse requestQuizDocId(
            Long userId,
            QuizRoom quizRoom
    ) {
        return restClient.post()
                .uri(ML_URL + "/generate")
                .contentType(APPLICATION_JSON)
                .body(CreateQuizRequest.builder()
                        .user_id(userId)
                        .timestamp(quizRoom.getCreatedAt().format(formatter))
                        .numOfQuiz(quizRoom.getNumOfQuiz())
                        .build()
                )
                .retrieve()
                .body(QuizDocIdMLResponse.class);
    }
}
