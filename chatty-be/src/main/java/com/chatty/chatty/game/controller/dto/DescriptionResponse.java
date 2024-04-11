package com.chatty.chatty.game.controller.dto;

import lombok.Builder;

@Builder
public record DescriptionResponse(
        String description
) {
}
