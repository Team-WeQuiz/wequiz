package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;

public record CreateRoomRequest(

        String name,

        Integer numOfQuiz,

        Integer timeLimit,

        Integer playerLimitNum,

        String code,

        String type,

        List<String> files
) {

}
