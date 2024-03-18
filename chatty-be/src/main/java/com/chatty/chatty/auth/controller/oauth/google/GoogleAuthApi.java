package com.chatty.chatty.auth.controller.oauth.google;

import com.chatty.chatty.auth.config.FeignConfiguration;
import com.chatty.chatty.auth.controller.oauth.dto.GoogleAccessTokenRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "googleAuth", url = "https://oauth2.googleapis.com/", configuration = FeignConfiguration.class)
public interface GoogleAuthApi {

    @PostMapping("/token")
    ResponseEntity<String> getAccessToken(@RequestBody GoogleAccessTokenRequest requestDto);

}