package com.chatty.chatty.auth.service.oauth;

import com.chatty.chatty.auth.controller.oauth.dto.SocialAuthResponse;
import com.chatty.chatty.auth.controller.oauth.dto.SocialUserResponse;
import com.chatty.chatty.auth.entity.Provider;
import org.springframework.stereotype.Service;

@Service
public interface SocialLoginService {

    Provider getServiceName();

    SocialAuthResponse getAccessToken(String authorizationCode);

    SocialUserResponse getUserInfo(String accessToken);
}
