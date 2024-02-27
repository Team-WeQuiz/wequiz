package com.chatty.chatty.auth.controller.dto;

public record SignUpRequest(
        String email,
        String password
) {

}
