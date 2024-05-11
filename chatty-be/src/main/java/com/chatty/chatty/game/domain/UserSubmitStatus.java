package com.chatty.chatty.game.domain;

import lombok.Builder;

@Builder
public record UserSubmitStatus(
        Long userId,

        String nickname,

        String profileImage,

        Boolean isSolved
) {

    private static final Boolean DEFAULT_SOLVED_STATUS = false;
    private static final Boolean SOLVED = true;

    public static UserSubmitStatus init(Long userId, String nickname, String profileImage) {
        return UserSubmitStatus.builder()
                .userId(userId)
                .nickname(nickname)
                .profileImage(profileImage)
                .isSolved(DEFAULT_SOLVED_STATUS)
                .build();
    }

    public UserSubmitStatus submit() {
        return new UserSubmitStatus(userId, nickname, profileImage, SOLVED);
    }
}
