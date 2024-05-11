package com.chatty.chatty.common.util;

public class RandomCodeGenerator {

    private static final int CODE_LENGTH = 6;

    public static String generateCode() {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append((int) (Math.random() * 10));
        }
        return code.toString();
    }
}
