package com.chatty.chatty.user.service;

import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.user.exception.UserExceptionType.USER_NOT_FOUND;

import com.chatty.chatty.auth.entity.Provider;
import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.player.domain.entity.Player;
import com.chatty.chatty.player.repository.PlayerRepository;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.user.controller.dto.ParticipatedQuizRoomDTO;
import com.chatty.chatty.user.controller.dto.ParticipatedQuizRoomListResponse;
import com.chatty.chatty.user.controller.dto.ProfileImageRequest;
import com.chatty.chatty.user.controller.dto.UserInfoResponse;
import com.chatty.chatty.user.entity.User;
import com.chatty.chatty.user.exception.UserException;
import com.chatty.chatty.user.repository.UserRepository;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
        String finalProfileImage = getProfileImageUrl(userId);
        return UserInfoResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .profileImage(finalProfileImage)
                .isValid(user.getIsValid())
                .loginType(user.getLoginType())
                .build();
    }

    public String getProfileImageUrl(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(USER_NOT_FOUND));
        String profileImage;
        if (user.getProfileImage() == null) {
            profileImage = null;
        } else if (user.getLoginType() != Provider.NORMAL && user.getProfileImage().startsWith("http")) {
            profileImage = user.getProfileImage();
        } else {
            profileImage = minioRepository.getProfileImageUrl(user.getProfileImage());
        }
        return profileImage;
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
                .totalPages(players.getTotalPages())
                .currentPage(players.getNumber() + 1)
                .rooms(roomDTOs)
                .build();
    }

    @Transactional
    public void setProfileImage(Long userId, ProfileImageRequest request) {
        userRepository.findById(userId)
                .ifPresent(user -> {
                    try {
                        String existingProfileImage = user.getProfileImage();
                        if (existingProfileImage != null && existingProfileImage
                                .startsWith(String.valueOf(userId))) {
                            minioRepository.deleteFile(existingProfileImage);
                        }
                        String profileImageName = minioRepository.saveProfileImage(
                                userId,
                                request.file().getInputStream(),
                                Objects.requireNonNull(request.file().getContentType())
                        );
                        user.changeProfileImage(profileImageName);
                        userRepository.save(user);
                    } catch (IOException e) {
                        throw new FileException(FILE_INPUT_STREAM_FAILED);
                    }
                });
    }
}