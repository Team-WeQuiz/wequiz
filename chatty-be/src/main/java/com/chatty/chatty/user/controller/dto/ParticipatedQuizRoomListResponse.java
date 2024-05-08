package com.chatty.chatty.user.controller.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record ParticipatedQuizRoomListResponse(
        Integer totalPages,
        Integer currentPage,
        List<ParticipatedQuizRoomDTO> rooms
) {

}
