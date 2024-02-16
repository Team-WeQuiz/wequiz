package com.chatty.chatty.auth.service;

import com.chatty.chatty.auth.controller.dto.SignupRequest;
import com.chatty.chatty.auth.controller.dto.TokenResponse;
import com.chatty.chatty.auth.entity.RefreshToken;
import com.chatty.chatty.auth.jwt.JwtUtil;
import com.chatty.chatty.auth.repository.RefreshTokenRepository;
import com.chatty.chatty.user.entity.User;
import com.chatty.chatty.user.repository.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.access-token-expiration}")
    private Long accessExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshExpiration;

    @Transactional
    public TokenResponse signup(SignupRequest request) {
        User newUser = User.builder()
                .username(request.username())
                .password(new BCryptPasswordEncoder().encode(request.password()))
                .email(request.email())
                .nickname(request.nickname())
                .age(request.age())
                .build();
        String accessToken = jwtUtil.createAccessToken(newUser, accessExpiration);
        String refreshToken = jwtUtil.createRefreshToken(newUser, refreshExpiration);

        userRepository.save(newUser);
        refreshTokenRepository.save(
                RefreshToken.builder()
                        .user(newUser)
                        .token(refreshToken)
                        .build()
        );
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}