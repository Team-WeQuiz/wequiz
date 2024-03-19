package com.chatty.chatty.auth.service;

import static com.chatty.chatty.auth.exception.AuthExceptionType.INVALID_PASSWORD;
import static com.chatty.chatty.auth.exception.AuthExceptionType.INVALID_TOKEN;
import static com.chatty.chatty.user.exception.UserExceptionType.USER_NOT_FOUND;

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
import java.util.Optional;
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
        User newUser = User.builder()
                .email(request.email())
                .password(new BCryptPasswordEncoder().encode(request.password()))
                .build();
        User savedUser = userRepository.save(newUser);
        String accessToken = jwtUtil.createAccessToken(savedUser);
        String refreshToken = jwtUtil.createRefreshToken(savedUser);

        refreshTokenRepository.save(
                RefreshToken.builder()
                        .user(savedUser)
                        .token(refreshToken)
                        .build()
        );
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public TokenResponse signIn(SignInRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
        if (!isPasswordValid(request, user)) {
            throw new AuthException(INVALID_PASSWORD);
        }
        //TODO: 리프레쉬 토큰 재발급 로직 구현
        RefreshToken refreshTokenEntity = refreshTokenRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AuthException(INVALID_TOKEN));
        String accessToken;
        String refreshToken = refreshTokenEntity.getToken();
        if (jwtUtil.isValidRefreshToken(refreshToken)) {
            accessToken = jwtUtil.createAccessToken(user);
            return TokenResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        }
        refreshToken = jwtUtil.createRefreshToken(user);
        accessToken = jwtUtil.createAccessToken(user);
        refreshTokenEntity.updateToken(refreshToken);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    private boolean isPasswordValid(SignInRequest request, User user) {
        return new BCryptPasswordEncoder().matches(request.password(), user.getPassword());
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}