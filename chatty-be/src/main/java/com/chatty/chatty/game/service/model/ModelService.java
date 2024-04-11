package com.chatty.chatty.game.service.model;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.FAILED_TO_CREATE_QUIZ;

import com.chatty.chatty.game.config.model.RestClientConfig;
import com.chatty.chatty.game.controller.dto.model.CreateQuizRequest;
import com.chatty.chatty.game.controller.dto.model.CreateQuizResponse;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
@Slf4j
public class ModelService {

    private final RestClientConfig restClientConfig;
    private final RestClient restClient;

    public ModelService(RestClientConfig restClientConfig) {
        this.restClientConfig = restClientConfig;
        this.restClient = restClientConfig.restClient();
    }

    public CreateQuizResponse createQuizData(CreateQuizRequest request) {
        ResponseEntity<CreateQuizResponse> createQuizResponse;
        try {
            createQuizResponse = restClient.post()
                    .uri("/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toEntity(CreateQuizResponse.class);
        } catch (RestClientException e) {
            throw new QuizRoomException(FAILED_TO_CREATE_QUIZ);
        }
        return createQuizResponse.getBody();
    }
}
