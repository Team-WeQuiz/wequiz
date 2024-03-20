package com.chatty.chatty.user.controller.dto;

import com.chatty.chatty.auth.entity.Provider;
import lombok.Builder;

@Builder
public record UserInfoResponse(
        Long id,
        String email,
        String profileImage,
        Provider loginType,
        Boolean isValid
) {

}
