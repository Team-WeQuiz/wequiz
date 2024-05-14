package com.chatty.chatty.auth.support;

import static com.chatty.chatty.auth.exception.AuthExceptionType.UNAUTHORIZED;

import com.chatty.chatty.auth.exception.AuthException;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@RequestScope
@Component
@Slf4j
public class AuthenticationContext {

    private Long userId;

    public void setAuthentication(Long userId) {
        this.userId = userId;
    }

    public Long getPrincipal() {
        if (Objects.isNull(userId)) {
            throw new AuthException(UNAUTHORIZED);
        }
        return userId;
    }
}
