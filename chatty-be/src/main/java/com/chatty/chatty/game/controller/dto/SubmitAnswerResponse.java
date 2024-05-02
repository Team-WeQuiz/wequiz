package com.chatty.chatty.game.controller.dto;

import com.chatty.chatty.game.domain.SubmitStatus;
import com.chatty.chatty.game.domain.UserSubmitStatus;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.Builder;

@Builder
public record SubmitAnswerResponse(
        SubmitStatus status,

        LocalDateTime timestamp,

        Set<UserSubmitStatus> submitStatuses
) {

}
