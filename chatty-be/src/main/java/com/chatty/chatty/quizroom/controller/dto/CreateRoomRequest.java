package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public record CreateRoomRequest(

        String name,

        String description,

        Integer numOfQuiz,

        Integer playerLimitNum,

        String type,

        List<MultipartFile> files
) {

}
