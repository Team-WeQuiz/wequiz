package com.chatty.chatty.auth.controller.dto;

import lombok.Builder;

@Builder
public record SignInResponse(
        String accessToken
) {

}
