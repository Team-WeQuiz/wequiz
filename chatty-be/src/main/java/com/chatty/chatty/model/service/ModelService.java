package com.chatty.chatty.model.service;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.FAILED_TO_MAKE_QUIZ;

import com.chatty.chatty.model.config.RestClientConfig;
import com.chatty.chatty.model.controller.dto.DescriptionModelResponse;
import com.chatty.chatty.model.controller.dto.MakeQuizRequest;
import com.chatty.chatty.model.controller.dto.MakeQuizResponse;
import com.chatty.chatty.model.controller.dto.QuizModelResponse;
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

    public MakeQuizResponse makeQuiz(MakeQuizRequest request) {
        ResponseEntity<MakeQuizResponse> makeQuizResponse;
        try {
            makeQuizResponse = restClient.post()
                    .uri("/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toEntity(MakeQuizResponse.class);
        } catch (RestClientException e) {
            throw new QuizRoomException(FAILED_TO_MAKE_QUIZ);
        }
        return makeQuizResponse.getBody();
    }

    public DescriptionModelResponse getDescriptionFromModel(Long quizDocId) {
        ResponseEntity<DescriptionModelResponse> descriptionModelResponse;
        descriptionModelResponse = restClient.get()
                .uri("/{quizDocId}/description", quizDocId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(DescriptionModelResponse.class);
        return descriptionModelResponse.getBody();
    }

    public QuizModelResponse getQuizFromModel(Long quizDocId) {
        ResponseEntity<QuizModelResponse> quizModelResponse;
        quizModelResponse = restClient.get()
                .uri("/{quizDocId}/questions", quizDocId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(QuizModelResponse.class);
        return quizModelResponse.getBody();
    }
}
