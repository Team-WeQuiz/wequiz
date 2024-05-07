package com.chatty.chatty.quizroom.controller.dto;

public record RoomResultResponse(
        Integer quizNumber,
        String quiz,
        String playerAnswer,
        Boolean marking,
        Integer correctRate
) {
}
