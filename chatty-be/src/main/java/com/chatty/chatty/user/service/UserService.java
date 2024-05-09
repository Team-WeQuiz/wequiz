package com.chatty.chatty.user.service;

import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.user.exception.UserExceptionType.USER_NOT_FOUND;

import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.player.domain.entity.Player;
import com.chatty.chatty.player.repository.PlayerRepository;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.user.controller.dto.ParticipatedQuizRoomDTO;
import com.chatty.chatty.user.controller.dto.ParticipatedQuizRoomListResponse;
import com.chatty.chatty.user.controller.dto.ProfileImageRequest;
import com.chatty.chatty.user.controller.dto.UserInfoResponse;
import com.chatty.chatty.user.exception.UserException;
import com.chatty.chatty.user.repository.UserRepository;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Integer DEFAULT_PAGE_SIZE = 8;
    private static final Integer ZERO = 0;

    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final MinioRepository minioRepository;

    public UserInfoResponse getUserInfo(Long userId) {
        return userRepository.findById(userId)
                .map(user -> UserInfoResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        //TODO: 프로필이미지
                        .profileImage(null)
                        .isValid(user.getIsValid())
                        .loginType(user.getLoginType())
                        .build())
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
    }

    public ParticipatedQuizRoomListResponse getParticipatedQuizRooms(Long userId, Integer page) {
        PageRequest pageRequest = PageRequest.of(page - 1, DEFAULT_PAGE_SIZE);
        Page<Player> players = playerRepository.findByUserIdOrderByCreatedAt(userId, pageRequest);
        if (players.isEmpty()) {
            return ParticipatedQuizRoomListResponse.builder()
                    .totalPages(ZERO)
                    .currentPage(ZERO)
                    .rooms(List.of())
                    .build();
        }
        List<ParticipatedQuizRoomDTO> roomDTOs = players.map(
                        player -> ParticipatedQuizRoomDTO.builder()
                                .roomId(player.getQuizRoom().getId())
                                .name(player.getQuizRoom().getName())
                                .description(player.getQuizRoom().getDescription())
                                .build())
                .toList();

        return ParticipatedQuizRoomListResponse.builder()
                .totalPages(players.getTotalPages() + 1)
                .currentPage(players.getNumber())
                .rooms(roomDTOs)
                .build();
    }

    @Transactional
    public void setProfileImage(Long userId, ProfileImageRequest request) {
        userRepository.findById(userId)
                .ifPresent(user -> {
                    try {
                        minioRepository.saveProfileImage(
                                userId,
                                request.file().getInputStream()
                        );
                    } catch (IOException e) {
                        throw new FileException(FILE_INPUT_STREAM_FAILED);
                    }
                });
    }
}