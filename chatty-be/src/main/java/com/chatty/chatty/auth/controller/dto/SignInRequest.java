package com.chatty.chatty.auth.controller.dto;

public record SigninRequest(
        String username,
        String password;
) {
    
}
