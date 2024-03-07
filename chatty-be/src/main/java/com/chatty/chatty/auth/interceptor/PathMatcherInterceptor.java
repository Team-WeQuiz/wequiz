package com.chatty.chatty.auth.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
public class PathMatcherInterceptor implements HandlerInterceptor {

    private final HandlerInterceptor handlerInterceptor;
    private final PathContainer pathContainer;

    public PathMatcherInterceptor(HandlerInterceptor handlerInterceptor) {
        this.handlerInterceptor = handlerInterceptor;
        this.pathContainer = new PathContainer();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if (pathContainer.isNotIncludedPath(request.getServletPath(), request.getMethod())) {
            return true;
        }
        return handlerInterceptor.preHandle(request, response, handler);
    }

    public PathMatcherInterceptor addPathPattern(String pathPattern, HttpMethod... httpMethod) {
        pathContainer.addIncludePatterns(pathPattern, httpMethod);
        return this;
    }

    public PathMatcherInterceptor excludePathPattern(String pathPattern, HttpMethod... httpMethod) {
        pathContainer.addExcludePatterns(pathPattern, httpMethod);
        return this;
    }

}
