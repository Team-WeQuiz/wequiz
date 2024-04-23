package com.chatty.chatty.common.util;

import static com.chatty.chatty.quizroom.exception.FileExceptionType.FAILED_TO_ENCRYPT;

import com.chatty.chatty.quizroom.exception.FileException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Sha256Encrypt {

    public static String encrypt(String msg) {
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new FileException(FAILED_TO_ENCRYPT);
        }
        md.update(msg.getBytes());
        return bytesToHex(md.digest());
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder();
        for (byte b : bytes) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    }
}
