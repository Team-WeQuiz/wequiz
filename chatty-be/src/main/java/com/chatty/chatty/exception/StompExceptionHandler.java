package com.chatty.chatty.exception;

import com.chatty.chatty.common.exception.BaseException;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class StompExceptionHandler extends StompSubProtocolErrorHandler {

    private static final String BASE_ERROR_MESSAGE = "INTERNAL_SERVER_ERROR";

    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof BaseException) {
            log.error(cause.getMessage(), cause);
            return errorMessage((BaseException) cause);
        }
        return errorMessage();
    }

    private Message<byte[]> errorMessage(BaseException ex) {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
        accessor.setLeaveMutable(true);
        log.error(ex.getMessage(), ex);
        String errorMessage = ex.getExceptionType().message();

        return MessageBuilder.createMessage(
                errorMessage.getBytes(StandardCharsets.UTF_8),
                accessor.getMessageHeaders()
        );
    }

    private Message<byte[]> errorMessage() {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
        accessor.setLeaveMutable(true);

        return MessageBuilder.createMessage(
                StompExceptionHandler.BASE_ERROR_MESSAGE.getBytes(StandardCharsets.UTF_8),
                accessor.getMessageHeaders()
        );
    }
}
