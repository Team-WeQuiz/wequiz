package com.chatty.chatty.auth.config;

import static com.chatty.chatty.auth.interceptor.HttpMethod.GET;
import static com.chatty.chatty.auth.interceptor.HttpMethod.OPTIONS;
import static com.chatty.chatty.auth.interceptor.HttpMethod.POST;

import com.chatty.chatty.auth.controller.AuthArgumentResolver;
import com.chatty.chatty.auth.interceptor.LoginInterceptor;
import com.chatty.chatty.auth.interceptor.PathMatcherInterceptor;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class AuthConfig implements WebMvcConfigurer {

    private final AuthArgumentResolver authArgumentResolver;
    private final LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor());
    }

    /*
    @AuthUser 어노테이션 사용 시 addPathPattern에 추가해야 함
     */
    private HandlerInterceptor loginInterceptor() {
        return new PathMatcherInterceptor(loginInterceptor)
                .excludePathPattern("/**", OPTIONS)
                .addPathPattern("/user", GET)
                .addPathPattern("/rooms", GET, POST);
//  예시            .addPathPattern("/test", GET, POST);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(authArgumentResolver);
    }
}
