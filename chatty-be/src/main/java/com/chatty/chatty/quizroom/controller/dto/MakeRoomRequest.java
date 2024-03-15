package com.chatty.chatty.quizroom.controller.dto;

public record MakeRoomRequest(

        String name,

        Integer numOfQuiz,

        Integer timeLimit,

        Integer playerLimitNum,

        String code,

        Long fileId
) {

}
