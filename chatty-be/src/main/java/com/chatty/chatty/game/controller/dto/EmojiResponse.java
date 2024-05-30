package com.chatty.chatty.game.controller.dto;

import lombok.Builder;

@Builder
public record EmojiResponse(
        Long userId,
        Integer emojiIndex
) {

}
