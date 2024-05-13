package com.chatty.chatty.auth.service.oauth;

import com.chatty.chatty.auth.controller.oauth.dto.GoogleAccessTokenRequest;
import com.chatty.chatty.auth.controller.oauth.dto.GoogleLoginResponse;
import com.chatty.chatty.auth.controller.oauth.dto.SocialAuthResponse;
import com.chatty.chatty.auth.controller.oauth.dto.SocialUserResponse;
import com.chatty.chatty.auth.controller.oauth.google.GoogleAuthApi;
import com.chatty.chatty.auth.controller.oauth.google.GoogleUserApi;
import com.chatty.chatty.auth.entity.Provider;
import com.chatty.chatty.auth.support.GsonLocalDateTimeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoogleLoginService implements SocialLoginService {

    private final GoogleAuthApi googleAuthApi;
    private final GoogleUserApi googleUserApi;

    @Value("${social.client.google.client-id}")
    private String googleAppKey;
    @Value("${social.client.google.client-secret}")
    private String googleAppSecret;
    @Value("${social.client.google.redirect-uri}")
    private String googleRedirectUri;
    @Value("${social.client.google.grant_type}")
    private String googleGrantType;

    @Override
    public Provider getServiceName() {
        return Provider.GOOGLE;
    }

    @Override
    public SocialAuthResponse getAccessToken(String authorizationCode) {
        ResponseEntity<?> response = googleAuthApi.getAccessToken(
                GoogleAccessTokenRequest.builder()
                        .code(authorizationCode)
                        .client_id(googleAppKey)
                        .client_secret(googleAppSecret)
                        .redirect_uri(googleRedirectUri)
                        .grant_type(googleGrantType)
                        .build()
        );
        return new Gson()
                .fromJson(
                        response.getBody().toString(),
                        SocialAuthResponse.class
                );
    }

    @Override
    public SocialUserResponse getUserInfo(String accessToken) {
        ResponseEntity<?> response = googleUserApi.getUserInfo(accessToken);
        String jsonString = response.getBody().toString();
        Gson gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDateTime.class, new GsonLocalDateTimeAdapter())
                .create();
        GoogleLoginResponse googleLoginResponse = gson.fromJson(jsonString, GoogleLoginResponse.class);
        return SocialUserResponse.builder()
                .email(googleLoginResponse.getEmail())
                .profileImage(googleLoginResponse.getPicture())
                .build();
    }
}