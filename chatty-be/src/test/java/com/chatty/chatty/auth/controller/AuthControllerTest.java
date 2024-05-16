package com.chatty.chatty.auth.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.chatty.chatty.auth.controller.dto.SignUpRequest;
import com.chatty.chatty.auth.controller.dto.TokenResponse;
import com.chatty.chatty.helper.MockBeanInjection;
import com.chatty.chatty.user.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
@SuppressWarnings("NonAsciiCharacters")
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc
class AuthControllerTest extends MockBeanInjection {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void 일반_회원가입_하면_토큰을_반환한다() throws Exception {
        SignUpRequest request = new SignUpRequest("test@gmail.com", "test");
        User user = createUser(request);
        TokenResponse tokenResponse = createTokenResponse(user);

        when(authService.signUp(any(SignUpRequest.class))).thenReturn(tokenResponse);

        mockMvc.perform(post("/auth/signUp")
                        .content(objectMapper.writeValueAsString(request))
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value(tokenResponse.accessToken()))
                .andExpect(jsonPath("$.refreshToken").value(tokenResponse.refreshToken()));

    }

    private User createUser(SignUpRequest request) {
        return User.builder()
                .id(1L)
                .email(request.email())
                .password(request.password())
                .build();
    }

    private TokenResponse createTokenResponse(User user) {
        String accessToken = jwtUtil.createAccessToken(user);
        String refreshToken = jwtUtil.createRefreshToken(user);
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}