package com.chatty.chatty.auth.controller.dto;

public record SignUpRequest(
        String username,
        String password,
        String email,
        String nickname
) {

}
