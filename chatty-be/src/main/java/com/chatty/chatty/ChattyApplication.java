package com.chatty.chatty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class ChattyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChattyApplication.class, args);
    }

}
