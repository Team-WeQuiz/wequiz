package com.chatty.chatty.common.util;

import static com.chatty.chatty.game.exception.GameExceptionType.THREAD_INTERRUPTED;

import com.chatty.chatty.game.exception.GameException;

public class ThreadSleep {

    public static void sleep(Long sleepTime) {
        try {
            Thread.sleep(sleepTime);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new GameException(THREAD_INTERRUPTED);
        }
    }
}
