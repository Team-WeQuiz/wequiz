package com.chatty.chatty.auth.entity;

import static com.chatty.chatty.auth.exception.AuthExceptionType.UNSUPPORTED_LOGIN_PROVIDER;

import com.chatty.chatty.auth.exception.AuthException;
import java.util.Arrays;

public enum Provider {
    NORMAL("normal"),
    GOOGLE("google"),
    KAKAO("kakao");

    private final String providerName;

    Provider(String providerName) {
        this.providerName = providerName;
    }

    public static Provider from(String name) {
        return Arrays.stream(values())
                .filter(it -> it.providerName.equals(name))
                .findFirst()
                .orElseThrow(() -> new AuthException(UNSUPPORTED_LOGIN_PROVIDER));
    }
}