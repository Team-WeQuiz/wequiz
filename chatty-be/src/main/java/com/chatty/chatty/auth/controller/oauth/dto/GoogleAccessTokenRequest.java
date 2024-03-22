package com.chatty.chatty.auth.controller.oauth.dto;

import lombok.Builder;

@Builder
public record GoogleAccessTokenRequest(
        String code,
        String client_id,
        String client_secret,
        String redirect_uri,
        String grant_type
) {

}