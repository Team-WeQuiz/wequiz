package com.chatty.chatty.common.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private SecretKey secretKey;

    public JwtUtil(@Value("${spring.jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                SIG.HS256.key().build().getAlgorithm());
    }

    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("username", String.class);
    }

    public Boolean isExpired(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }

    public String createJwt(String username, Long expiration) {
        return Jwts.builder()
                .claim("username", username)
                .issuedAt(new Date(System.currentTimeMillis())) // 발행 시간
                .expiration(new Date(System.currentTimeMillis() + expiration)) // 만료 시간
                .signWith(secretKey) // secretKey 를 통해 암호화
                .compact();
    }
}
