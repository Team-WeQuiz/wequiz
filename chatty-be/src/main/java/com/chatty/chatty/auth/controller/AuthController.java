package com.chatty.chatty.auth.controller;

import com.chatty.chatty.auth.controller.dto.RefreshTokenRequest;
import com.chatty.chatty.auth.controller.dto.SignInRequest;
import com.chatty.chatty.auth.controller.dto.SignUpRequest;
import com.chatty.chatty.auth.controller.dto.TokenResponse;
import com.chatty.chatty.auth.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signUp")
    public ResponseEntity<TokenResponse> signUp(@RequestBody SignUpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signUp(request));
    }

    @PostMapping("/signIn")
    public ResponseEntity<TokenResponse> signIn(@RequestBody SignInRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(authService.signIn(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(authService.refresh(request));
    }
}
