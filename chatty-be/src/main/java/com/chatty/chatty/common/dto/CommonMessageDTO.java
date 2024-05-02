package com.chatty.chatty.common.dto;

import lombok.Builder;

@Builder
public record CommonMessageDTO(
        String message
) {

}
