package com.chatty.chatty.auth.service.oauth;

import com.chatty.chatty.auth.controller.oauth.dto.KakaoLoginResponse;
import com.chatty.chatty.auth.controller.oauth.dto.KakaoLoginResponse.KakaoAccount;
import com.chatty.chatty.auth.controller.oauth.dto.KakaoLoginResponse.KakaoProperties;
import com.chatty.chatty.auth.controller.oauth.dto.SocialAuthResponse;
import com.chatty.chatty.auth.controller.oauth.dto.SocialUserResponse;
import com.chatty.chatty.auth.controller.oauth.kakao.KakaoAuthApi;
import com.chatty.chatty.auth.controller.oauth.kakao.KakaoUserApi;
import com.chatty.chatty.auth.entity.Provider;
import com.chatty.chatty.auth.support.GsonLocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoLoginService implements SocialLoginService {

    private final KakaoAuthApi kakaoAuthApi;
    private final KakaoUserApi kakaoUserApi;

    @Value("${social.client.kakao.client-id}")
    private String kakaoAppKey;
    @Value("${social.client.kakao.client-secret}")
    private String kakaoAppSecret;
    @Value("${social.client.kakao.redirect-uri}")
    private String kakaoRedirectUri;
    @Value("${social.client.kakao.grant_type}")
    private String kakaoGrantType;

    @Override
    public Provider getServiceName() {
        return Provider.KAKAO;
    }

    @Override
    public SocialAuthResponse getAccessToken(String authorizationCode) {
        ResponseEntity<?> response = kakaoAuthApi.getAccessToken(
                authorizationCode,
                kakaoAppKey,
                kakaoAppSecret,
                kakaoRedirectUri,
                kakaoGrantType
        );
        return new Gson()
                .fromJson(
                        response.getBody().toString(),
                        SocialAuthResponse.class
                );
    }

    @Override
    public SocialUserResponse getUserInfo(String accessToken) {
        Map<String, String> headerMap = new HashMap<>();
        headerMap.put("authorization", "Bearer " + accessToken);
        ResponseEntity<?> response = kakaoUserApi.getUserInfo(headerMap);
        log.info("response : {}", response);
        String jsonString = response.getBody().toString();
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDateTime.class, new GsonLocalDateTimeAdapter())
                .create();
        KakaoLoginResponse kaKaoLoginResponse = gson.fromJson(jsonString, KakaoLoginResponse.class);
        KakaoAccount kakao_account = kaKaoLoginResponse.getKakao_account();
        KakaoProperties kakao_properties = kaKaoLoginResponse.getProperties();
        log.info("kakao_account : {}", kakao_account);
        log.info("kakao_properties : {}", kakao_properties);
        return SocialUserResponse.builder()
                .userEmail(kakao_account.getEmail())
                .profileImage(kakao_properties.getProfile_image())
                .build();
    }
}