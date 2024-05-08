package com.chatty.chatty.auth.service;

import static com.chatty.chatty.auth.exception.AuthExceptionType.*;
import static com.chatty.chatty.user.exception.UserExceptionType.USER_NOT_FOUND;

import com.chatty.chatty.auth.controller.dto.PasswordRequest;
import com.chatty.chatty.auth.controller.dto.RefreshTokenRequest;
import com.chatty.chatty.auth.controller.dto.SignInRequest;
import com.chatty.chatty.auth.controller.dto.SignUpRequest;
import com.chatty.chatty.auth.controller.dto.TokenResponse;
import com.chatty.chatty.auth.entity.RefreshToken;
import com.chatty.chatty.auth.exception.AuthException;
import com.chatty.chatty.auth.jwt.JwtUtil;
import com.chatty.chatty.auth.repository.RefreshTokenRepository;
import com.chatty.chatty.user.entity.User;
import com.chatty.chatty.user.exception.UserException;
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
    public TokenResponse signUp(SignUpRequest request) {
        validateDuplicateEmail(request.email());
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
        return TokenResponse.builder()
                .accessToken(jwtUtil.createAccessToken(savedUser))
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public TokenResponse signIn(SignInRequest request) {
        User user = findUserByEmail(request.email());
        validateSignInRequest(user.getId(), request.password());
        return TokenResponse.builder()
                .accessToken(jwtUtil.createAccessToken(user))
                .refreshToken(getRefreshToken(user.getId()))
                .build();
    }

    @Transactional
    public void changePassword(Long userId, PasswordRequest request) {
        User user = findUserById(userId);
        if (!isPasswordValid(userId, request.oldPassword())) {
            throw new AuthException(INVALID_PASSWORD);
        }
        user.changePassword(encoded(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public TokenResponse refresh(RefreshTokenRequest request) {
        User user = findUserById(jwtUtil.getUserIdFromToken(request.refreshToken()));
        refreshTokenRepository.deleteByUserId(user.getId());
        String refreshToken = jwtUtil.createRefreshToken(user);
        refreshTokenRepository.save(
                RefreshToken.builder()
                        .user(user)
                        .token(refreshToken)
                        .build()
        );
        return TokenResponse.builder()
                .accessToken(jwtUtil.createAccessToken(user))
                .refreshToken(refreshToken)
                .build();
    }

    private void validateDuplicateEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new AuthException(INVALID_EMAIL);
        }
    }

    private String encoded(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }

    private void validateSignInRequest(Long userId, String password) {
        validatePassword(userId, password);
        validateRefreshToken(userId);
    }

    private void validateRefreshToken(Long userId) {
        String refreshToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new AuthException(INVALID_TOKEN))
                .getToken();
        if (!jwtUtil.isRefreshTokenValid(refreshToken)) {
            throw new AuthException(INVALID_TOKEN);
        }
    }

    private void validatePassword(Long userId, String password) {
        if (!isPasswordValid(userId, password)) {
            throw new AuthException(INVALID_PASSWORD);
        }
    }

    private boolean isPasswordValid(Long userId, String password) {
        User user = findUserById(userId);
        return new BCryptPasswordEncoder().matches(password, user.getPassword());
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
    }

    private String getRefreshToken(Long userId) {
        return refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new AuthException(INVALID_TOKEN))
                .getToken();
    }
}