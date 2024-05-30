package com.chatty.chatty.game.controller.dto;

import lombok.Builder;

@Builder
public record EmojiResponse(
        Long roomId,
        Long userId,
        Integer emojiIndex
) {

}
