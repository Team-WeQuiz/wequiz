package com.chatty.chatty.auth.controller.oauth;

import com.chatty.chatty.auth.controller.dto.TokenResponse;
import com.chatty.chatty.auth.controller.oauth.dto.SocialLoginRequest;
import com.chatty.chatty.auth.entity.Provider;
import com.chatty.chatty.auth.service.oauth.OAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oAuthService;

    @PostMapping("/oauth/{provider}/login")
    public ResponseEntity<TokenResponse> signIn(
            @RequestBody SocialLoginRequest request,
            @PathVariable String provider
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(oAuthService.signIn(request, Provider.from(provider)));
    }
}
