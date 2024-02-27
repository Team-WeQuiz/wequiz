package com.chatty.chatty.auth.controller.dto;

public record SignInRequest(
        String email,
        String password
) {

}
