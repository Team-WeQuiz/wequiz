package com.chatty.chatty.user.service;

import static com.chatty.chatty.user.exception.UserExceptionType.USER_NOT_FOUND;

import com.chatty.chatty.player.domain.entity.Player;
import com.chatty.chatty.player.repository.PlayerRepository;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.user.controller.dto.ParticipatedQuizRoomDTO;
import com.chatty.chatty.user.controller.dto.ParticipatedQuizRoomListResponse;
import com.chatty.chatty.user.controller.dto.UserInfoResponse;
import com.chatty.chatty.user.exception.UserException;
import com.chatty.chatty.user.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;

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

    public ParticipatedQuizRoomListResponse getParticipatedQuizRooms(Long userId, Pageable pageable) {
        Page<Player> players = playerRepository.findByUserId(userId, pageable);
        List<ParticipatedQuizRoomDTO> roomDTOs = players.map(player -> ParticipatedQuizRoomDTO.builder()
                .roomId(player.getQuizRoom().getId())
                .name(player.getQuizRoom().getName())
                .description(player.getQuizRoom().getDescription())
                .build()).toList();

        return ParticipatedQuizRoomListResponse.builder()
                .totalPages(players.getTotalPages())
                .currentPage(players.getNumber())
                .rooms(roomDTOs)
                .build();
    }
}