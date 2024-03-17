package com.chatty.chatty.auth.controller.oauth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KakaoLoginResponse {

    private Long id;
    private KakaoAccount kakao_account;
    private KakaoProperties properties;

    @Getter
    public static class KakaoAccount {

        private String email;
    }

    @Getter
    public static class KakaoProperties {

        private String profile_image;
    }
}