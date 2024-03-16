package com.chatty.chatty.auth.controller.oauth.kakao;

import com.chatty.chatty.auth.config.FeignConfiguration;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "kakaoAuth", url = "https://kauth.kakao.com", configuration = {FeignConfiguration.class})
public interface KakaoAuthApi {

    @GetMapping("/oauth/token")
    ResponseEntity<String> getAccessToken(
            @RequestParam("code") String code,
            @RequestParam("client_id") String clientId,
            @RequestParam("client_secret") String clientSecret,
            @RequestParam("redirect_uri") String redirectUri,
            @RequestParam("grant_type") String grantType
    );
}