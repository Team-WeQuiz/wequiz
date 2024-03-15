package com.chatty.chatty.quizroom.service;

import com.chatty.chatty.quizroom.config.RestClientConfig;
import com.chatty.chatty.quizroom.controller.dto.MakeQuizRequest;
import com.chatty.chatty.quizroom.controller.dto.MakeQuizResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ModelService {

    private final RestClientConfig restClientConfig;
    private final RestClient restClient;

    public ModelService(RestClientConfig restClientConfig) {
        this.restClientConfig = restClientConfig;
        this.restClient = restClientConfig.restClient();
    }

    public MakeQuizResponse makeQuiz(MakeQuizRequest request) {
        ResponseEntity<MakeQuizResponse> makeQuizResponse = restClient.post()
                .uri("/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .toEntity(MakeQuizResponse.class);
        return makeQuizResponse.getBody();
    }
}
