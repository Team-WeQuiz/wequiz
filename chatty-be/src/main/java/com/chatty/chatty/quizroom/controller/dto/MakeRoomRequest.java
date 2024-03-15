package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;

public record MakeRoomRequest(

        String name,

        Integer numOfQuiz,

        Integer timeLimit,

        Integer playerLimitNum,

        String code,

        List<String> files
) {

}
