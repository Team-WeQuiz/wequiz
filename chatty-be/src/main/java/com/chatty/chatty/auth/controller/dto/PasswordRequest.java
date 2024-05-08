package com.chatty.chatty.auth.controller.dto;

public record PasswordRequest(
        String oldPassword,
        String newPassword
) {

}
