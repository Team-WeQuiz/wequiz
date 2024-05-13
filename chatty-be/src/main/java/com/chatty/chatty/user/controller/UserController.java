package com.chatty.chatty.user.controller;

import com.chatty.chatty.auth.support.AuthUser;
import com.chatty.chatty.user.controller.dto.ParticipatedQuizRoomListResponse;
import com.chatty.chatty.user.controller.dto.ProfileImageRequest;
import com.chatty.chatty.user.controller.dto.UserInfoResponse;
import com.chatty.chatty.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserInfoResponse> getUserInfo(@AuthUser Long userId) {
        return ResponseEntity.ok(userService.getUserInfo(userId));
    }

    @GetMapping("/participated-rooms")
    public ResponseEntity<ParticipatedQuizRoomListResponse> getParticipatedQuizRooms(@AuthUser Long userId,
            @RequestParam(defaultValue = "1") Integer page) {
        return ResponseEntity.ok(userService.getParticipatedQuizRooms(userId, page));
    }

    @PostMapping("/profile-image")
    public ResponseEntity<Void> setProfileImage(@AuthUser Long userId, @ModelAttribute ProfileImageRequest request) {
        userService.setProfileImage(userId, request);
        return ResponseEntity.ok().build();
    }

}
