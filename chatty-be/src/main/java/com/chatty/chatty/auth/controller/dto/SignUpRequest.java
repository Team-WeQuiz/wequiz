package com.chatty.chatty.auth.controller.dto;

public record SignupRequest(
        String username,
        String password,
        String email,
        String nickname,
        Integer age
) {

}
