package com.chatty.chatty.model.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import com.chatty.chatty.quizroom.controller.dto.MakeQuizRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;

class ModelServiceTest {

    private final RestClient restClient;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final String ML_URL = "https://gen.wequiz.kr";

    public ModelServiceTest() {
        this.restClient = RestClient.builder().build();
    }

    @Test
    void makeQuiz() {
        String body = restClient.post().uri(ML_URL + "/generate")
                .contentType(APPLICATION_JSON)
                .body(MakeQuizRequest.builder()
                        .user_id(1L)
                        .timestamp(LocalDateTime.now().format(formatter))
                        .numOfQuiz(5)
                        .files(List.of("2/pdf/file-f0222d2e-fa54-4ced-870d-5de6a4f412c1.pdf"))
                        .build())
                .retrieve()
                .body(String.class);
        System.out.println(body);
    }
}