package com.chatty.chatty.user.service;

import static com.chatty.chatty.user.exception.UserExceptionType.USER_NOT_FOUND;

import com.chatty.chatty.user.controller.dto.UserInfoResponse;
import com.chatty.chatty.user.exception.UserException;
import com.chatty.chatty.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserInfoResponse getUserInfo(Long userId) {
        return userRepository.findById(userId)
                .map(user -> UserInfoResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .profileImage(user.getProfileImage())
                        .isValid(user.getIsValid())
                        .loginType(user.getLoginType())
                        .build())
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
    }
}