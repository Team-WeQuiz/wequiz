package com.chatty.chatty.auth.jwt;

import static com.chatty.chatty.auth.exception.AuthExceptionType.EXPIRED_TOKEN;
import static com.chatty.chatty.auth.exception.AuthExceptionType.INVALID_SIGNATURE;
import static com.chatty.chatty.auth.exception.AuthExceptionType.INVALID_TOKEN;
import static com.chatty.chatty.auth.exception.AuthExceptionType.MALFORMED_TOKEN;
import static com.chatty.chatty.auth.exception.AuthExceptionType.SIGNATURE_NOT_FOUND;
import static com.chatty.chatty.auth.exception.AuthExceptionType.UNSUPPORTED_TOKEN;

import com.chatty.chatty.auth.exception.AuthException;
import com.chatty.chatty.auth.exception.AuthExceptionType;
import com.chatty.chatty.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtUtil {

    private final SecretKey secretKey;

    @Value("${jwt.access-token-expiration}")
    private Long accessExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshExpiration;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                SIG.HS256.key().build().getAlgorithm());
    }

    public String createAccessToken(User user) {
        return Jwts.builder()
                .claim("id", user.getId())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(User user) {
        return Jwts.builder()
                .claim("id", user.getId())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(secretKey)
                .compact();
    }

    public boolean isValidRefreshToken(String refreshToken) {
        if (isTokenExpired(refreshToken)) {
            return false;
        }
        try {
            getClaimFromToken(refreshToken);
            return true;
        } catch (NullPointerException | JwtException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return getClaimFromToken(token).getExpiration().before(new Date());
    }

    public Long extract(String token) {
        try {
            return getClaimFromToken(token).get("id", Long.class);
        } catch (SecurityException e) {
            throw new AuthException(SIGNATURE_NOT_FOUND);
        } catch (MalformedJwtException e) {
            throw new AuthException(MALFORMED_TOKEN);
        } catch (ExpiredJwtException e) {
            throw new AuthException(EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new AuthException(UNSUPPORTED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new AuthException(INVALID_TOKEN);
        } catch (SignatureException e) {
            throw new AuthException(INVALID_SIGNATURE);
        }
    }

    private Claims getClaimFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
