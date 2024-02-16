package com.chatty.chatty.dto;

public record SignupRequestDto(
        String username,
        String password,
        String email,
        String nickname,
        Integer age
) {

}
