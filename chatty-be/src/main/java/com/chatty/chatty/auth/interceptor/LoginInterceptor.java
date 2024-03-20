package com.chatty.chatty.auth.interceptor;

import static com.chatty.chatty.auth.exception.AuthExceptionType.UNAUTHORIZED;

import com.chatty.chatty.auth.exception.AuthException;
import com.chatty.chatty.auth.jwt.JwtUtil;
import com.chatty.chatty.auth.support.AuthenticationContext;
import com.chatty.chatty.auth.support.AuthenticationExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Component
@Slf4j
public class LoginInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;
    private final AuthenticationContext authenticationContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = AuthenticationExtractor.extract(request)
                .orElseThrow(() -> new AuthException(UNAUTHORIZED));
        Long userId = jwtUtil.getUserIdFromToken(token);
        log.info("userId: {}", userId);
        authenticationContext.setAuthentication(userId);
        return true;
    }
}
