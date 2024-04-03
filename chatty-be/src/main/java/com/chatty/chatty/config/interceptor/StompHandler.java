package com.chatty.chatty.config.interceptor;

import com.chatty.chatty.auth.jwt.JwtUtil;
import com.chatty.chatty.auth.support.AuthenticationExtractor;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StompHandler implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = AuthenticationExtractor.extract(accessor.getFirstNativeHeader("Authorization"))
                    .orElse(null);
            Optional<Long> userId = jwtUtil.getUserIdFromTokenWithoutException(token);
            userId.ifPresent(id -> accessor.getSessionAttributes().put("userId", id));
        }

        return message;
    }
}
