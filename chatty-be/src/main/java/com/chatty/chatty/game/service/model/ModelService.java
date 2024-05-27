package com.chatty.chatty.game.service.model;

import static com.chatty.chatty.game.exception.ModelExceptionType.FAILED_TO_CREATE;
import static com.chatty.chatty.game.exception.ModelExceptionType.FILE_NOT_AVAILABLE;
import static com.chatty.chatty.game.exception.ModelExceptionType.INSUFFICIENT_TOKENS;
import static com.chatty.chatty.game.exception.ModelExceptionType.TOO_MANY_PAGES;
import static com.chatty.chatty.game.exception.ModelExceptionType.TOO_MANY_TOKENS;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.PAYLOAD_TOO_LARGE;
import static org.springframework.http.HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.game.controller.dto.model.CreateQuizRequest;
import com.chatty.chatty.game.controller.dto.model.MarkRequest;
import com.chatty.chatty.game.controller.dto.model.MarkResponse;
import com.chatty.chatty.game.exception.ModelException;
import com.chatty.chatty.quizroom.controller.dto.QuizDocIdMLResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class ModelService {

    @Value("${url.ml}")
    private String ML_URL;

    private final RestClient restClient;
    private final MinioRepository minioRepository;

    public QuizDocIdMLResponse requestQuizDocId(
            Long userId,
            QuizRoom quizRoom,
            List<String> fileNames
    ) {
        return restClient.post()
                .uri(ML_URL + "/generate")
                .contentType(APPLICATION_JSON)
                .body(CreateQuizRequest.builder()
                        .user_id(userId)
                        .timestamp(quizRoom.getCreatedAt().toString())
                        .num_of_quiz(quizRoom.getNumOfQuiz())
                        .build()
                )
                .retrieve()
                .onStatus(status -> status.value() == INTERNAL_SERVER_ERROR.value(),
                        (req, res) -> {
                            minioRepository.deleteFiles(fileNames);
                            throw new ModelException(FAILED_TO_CREATE);
                        }
                )
                .onStatus(status -> status.value() == UNPROCESSABLE_ENTITY.value(),
                        (req, res) -> {
                            minioRepository.deleteFiles(fileNames);
                            throw new ModelException(INSUFFICIENT_TOKENS);
                        }
                )
                .onStatus(status -> status.value() == PAYLOAD_TOO_LARGE.value(),
                        (req, res) -> {
                            minioRepository.deleteFiles(fileNames);
                            throw new ModelException(TOO_MANY_TOKENS);
                        }
                )
                .onStatus(status -> status.value() == REQUESTED_RANGE_NOT_SATISFIABLE.value(),
                        (req, res) -> {
                            minioRepository.deleteFiles(fileNames);
                            throw new ModelException(TOO_MANY_PAGES);
                        }
                )
                .onStatus(status -> status.value() == BAD_REQUEST.value(),
                        (req, res) -> {
                            minioRepository.deleteFiles(fileNames);
                            throw new ModelException(FILE_NOT_AVAILABLE);
                        }
                )
                .body(QuizDocIdMLResponse.class);
    }

    public MarkResponse requestMark(MarkRequest request) {
        return restClient.post()
                .uri(ML_URL + "/mark")
                .contentType(APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(MarkResponse.class);
    }
}
