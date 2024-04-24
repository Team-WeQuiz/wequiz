package com.chatty.chatty.quizroom.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record RoomListResponse(
        Long totalPages,
        Long currentPage,
        List<RoomAbstractDTO> rooms
) {

}
