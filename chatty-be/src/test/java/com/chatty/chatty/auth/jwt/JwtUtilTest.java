package com.chatty.chatty.auth.jwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.chatty.chatty.user.entity.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
@SuppressWarnings("NonAsciiCharacters")
class JwtUtilTest {

    private JwtUtil jwtUtil;

    private static final String SECRET_KEY = "qwerasdfzxcvdsafdsaffdasafdfdsafdsafdsafdsasfda";
    private static final Long ACCESS_EXPIRATION = 86400000L;
    private static final Long REFRESH_EXPIRATION = 2592000000L;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(SECRET_KEY);
        jwtUtil.setAccessExpiration(ACCESS_EXPIRATION);
        jwtUtil.setRefreshExpiration(REFRESH_EXPIRATION);
    }

    @Test
    void 토큰에서_유저Id를_가져온다() {
        // given
        User user = User.builder()
                .id(1L)
                .build();
        String token = jwtUtil.createAccessToken(user);

        // when
        Long userId = jwtUtil.getUserIdFromToken(token);

        // then
        assertThat(userId).isEqualTo(user.getId());
    }

    @Test
    void 리프레쉬_토큰이_만료되었는지_확인한다() {
        User user = User.builder()
                .id(1L)
                .build();
        String validRefreshToken = getRefreshToken(user, expiration(REFRESH_EXPIRATION));
        String invalidRefreshToken = getRefreshToken(user, expiration(-REFRESH_EXPIRATION));

        assertThat(jwtUtil.isRefreshTokenValid(validRefreshToken)).isTrue();
        assertThatThrownBy(() -> jwtUtil.isRefreshTokenValid(invalidRefreshToken))
                .isInstanceOf(JwtException.class);
    }

    private String getRefreshToken(User user, Date expiration) {
        return Jwts.builder()
                .claim("id", user.getId())
                .expiration(expiration)
                .signWith(new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                        SIG.HS256.key().build().getAlgorithm()))
                .compact();
    }

    private Date expiration(Long refreshExpiration) {
        return new Date(System.currentTimeMillis() + refreshExpiration);
    }
}