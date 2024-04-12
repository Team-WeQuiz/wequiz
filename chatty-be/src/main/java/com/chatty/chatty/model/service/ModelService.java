package com.chatty.chatty.model.service;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import com.chatty.chatty.quizroom.controller.dto.GenerateQuizMLResponse;
import com.chatty.chatty.quizroom.controller.dto.MakeQuizRequest;
import com.chatty.chatty.quizroom.domain.entity.QuizRoom;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClient.RequestBodySpec;

@Service
@RequiredArgsConstructor
public class ModelService {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Value("${url.ml}")
    private String ML_URL;

    private final RestClient restClient;

    public GenerateQuizMLResponse makeQuiz(
            Long userId,
            QuizRoom quizRoom,
            List<String> fileNames
    ) {
        return requestQuizGeneration(userId, quizRoom, fileNames)
                .retrieve()
                .toEntity(GenerateQuizMLResponse.class)
                .getBody();
    }

    private RequestBodySpec requestQuizGeneration(Long userId, QuizRoom quizRoom, List<String> fileNames) {
        return restClient.post()
                .uri(ML_URL + "/generate")
                .contentType(APPLICATION_JSON)
                .body(MakeQuizRequest.builder()
                        .user_id(userId)
                        .timestamp(quizRoom.getCreatedAt().format(formatter))
                        .numOfQuiz(quizRoom.getNumOfQuiz())
                        .files(fileNames)
                        .build());
    }
}
