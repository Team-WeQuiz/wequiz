package com.chatty.chatty.auth.controller.dto;

public record SignInRequest(
        String username,
        String password
) {

}
