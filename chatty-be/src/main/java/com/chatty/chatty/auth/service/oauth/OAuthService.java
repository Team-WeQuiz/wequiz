package com.chatty.chatty.auth.service.oauth;

import static com.chatty.chatty.auth.exception.AuthExceptionType.INVALID_TOKEN;
import static com.chatty.chatty.auth.exception.AuthExceptionType.UNSUPPORTED_LOGIN_PROVIDER;

import com.chatty.chatty.auth.controller.dto.TokenResponse;
import com.chatty.chatty.auth.controller.oauth.dto.SocialAuthResponse;
import com.chatty.chatty.auth.controller.oauth.dto.SocialLoginRequest;
import com.chatty.chatty.auth.controller.oauth.dto.SocialUserResponse;
import com.chatty.chatty.auth.entity.Provider;
import com.chatty.chatty.auth.entity.RefreshToken;
import com.chatty.chatty.auth.exception.AuthException;
import com.chatty.chatty.auth.jwt.JwtUtil;
import com.chatty.chatty.auth.repository.RefreshTokenRepository;
import com.chatty.chatty.user.entity.User;
import com.chatty.chatty.user.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthService {

    private final List<SocialLoginService> loginServices;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public TokenResponse signIn(SocialLoginRequest request, Provider provider) {
        SocialLoginService loginService = getLoginService(provider);
        SocialAuthResponse socialAuthResponse = loginService.getAccessToken(request.code());
        SocialUserResponse socialUserResponse = loginService.getUserInfo(socialAuthResponse.getAccess_token());

        Optional<User> optionalUser = userRepository.findByEmail(socialUserResponse.email());
        User user;

        if (optionalUser.isEmpty()) {
            User newUser = User.builder()
                    .email(socialUserResponse.email())
                    .isValid(true)
                    .loginType(loginService.getServiceName())
                    .profileImage(socialUserResponse.profileImage())
                    .build();
            user = join(newUser, loginService);
        } else {
            user = optionalUser.get();
        }

        String accessToken = jwtUtil.createAccessToken(user);
        String refreshToken;
        try {
            refreshToken = getRefreshToken(user.getId());
        } catch (AuthException e) {
            refreshToken = jwtUtil.createRefreshToken(user);
            refreshTokenRepository.save(RefreshToken.builder()
                    .user(user)
                    .token(refreshToken)
                    .build());
        }
        return new TokenResponse(accessToken, refreshToken);
    }

    private SocialLoginService getLoginService(Provider provider) {
        for (SocialLoginService loginService : loginServices) {
            if (provider.equals(loginService.getServiceName())) {
                return loginService;
            }
        }
        throw new AuthException(UNSUPPORTED_LOGIN_PROVIDER);
    }

    private User join(User user, SocialLoginService loginService) {
        return userRepository.save(User.builder()
                .email(user.getEmail())
                .isValid(true)
                .loginType(loginService.getServiceName())
                .profileImage(user.getProfileImage())
                .build());
    }

    private String getRefreshToken(Long userId) {
        return refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new AuthException(INVALID_TOKEN))
                .getToken();
    }
}