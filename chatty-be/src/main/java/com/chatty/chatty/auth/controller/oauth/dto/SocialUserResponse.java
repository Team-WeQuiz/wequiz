package com.chatty.chatty.auth.controller.oauth.dto;

import lombok.Builder;

@Builder
public record SocialUserResponse(
        String email,
        String profileImage
) {

}