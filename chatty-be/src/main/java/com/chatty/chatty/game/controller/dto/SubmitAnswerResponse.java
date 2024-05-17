package com.chatty.chatty.game.controller.dto;

import com.chatty.chatty.game.domain.UserSubmitStatus;
import java.util.Set;
import lombok.Builder;

@Builder
public record SubmitAnswerResponse(
        Boolean isMajority,

        Set<UserSubmitStatus> submitStatuses
) {

}
