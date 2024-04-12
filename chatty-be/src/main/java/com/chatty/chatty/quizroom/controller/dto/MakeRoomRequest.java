package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public record MakeRoomRequest(

        String name,

        Integer numOfQuiz,

        Integer timeLimit,

        Integer playerLimitNum,

        String code,

        String type,

        List<MultipartFile> files
) {

}
