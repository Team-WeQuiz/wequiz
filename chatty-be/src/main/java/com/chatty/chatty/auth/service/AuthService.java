package com.chatty.chatty.auth.service;

import static com.chatty.chatty.auth.exception.AuthExceptionType.*;

import com.chatty.chatty.auth.controller.dto.SignInRequest;
import com.chatty.chatty.auth.controller.dto.SignInResponse;
import com.chatty.chatty.auth.controller.dto.SignUpRequest;
import com.chatty.chatty.auth.controller.dto.SignUpResponse;
import com.chatty.chatty.auth.entity.RefreshToken;
import com.chatty.chatty.auth.exception.AuthException;
import com.chatty.chatty.auth.jwt.JwtUtil;
import com.chatty.chatty.auth.repository.RefreshTokenRepository;
import com.chatty.chatty.user.entity.User;
import com.chatty.chatty.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public SignUpResponse signUp(SignUpRequest request) {
        validateDuplicateEmail(request);
        User newUser = User.builder()
                .email(request.email())
                .password(encoded(request.password()))
                .build();
        User savedUser = userRepository.save(newUser);
        String refreshToken = jwtUtil.createRefreshToken(savedUser);

        refreshTokenRepository.save(
                RefreshToken.builder()
                        .user(savedUser)
                        .token(refreshToken)
                        .build()
        );
        return SignUpResponse.builder()
                .accessToken(jwtUtil.createAccessToken(savedUser))
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public SignInResponse signIn(SignInRequest request) {
        User user = findUserByEmail(request.email());
        validateSignInRequest(request, user);
        String accessToken = jwtUtil.createAccessToken(user);
        return SignInResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    private void validateDuplicateEmail(SignUpRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new AuthException(INVALID_EMAIL);
        }
    }

    private String encoded(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }

    private void validateSignInRequest(SignInRequest request, User user) {
        validatePassword(request, user);
        validateRefreshToken(user);
    }

    private void validateRefreshToken(User user) {
        String refreshToken = refreshTokenRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AuthException(INVALID_TOKEN))
                .getToken();
        if (!jwtUtil.isRefreshTokenValid(refreshToken)) {
            throw new AuthException(INVALID_TOKEN);
        }
    }

    private void validatePassword(SignInRequest request, User user) {
        if (!isPasswordValid(request, user)) {
            throw new AuthException(INVALID_PASSWORD);
        }
    }

    private boolean isPasswordValid(SignInRequest request, User user) {
        return new BCryptPasswordEncoder().matches(request.password(), user.getPassword());
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException(USER_NOT_FOUND));
    }
}