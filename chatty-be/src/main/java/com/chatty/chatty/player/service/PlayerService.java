package com.chatty.chatty.player.service;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.user.exception.UserExceptionType.USER_NOT_FOUND;

import com.chatty.chatty.player.domain.entity.Player;
import com.chatty.chatty.player.repository.PlayerRepository;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import com.chatty.chatty.user.exception.UserException;
import com.chatty.chatty.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;
    private final QuizRoomRepository quizRoomRepository;

    @Transactional
    public void savePlayer(Long userId, Long roomId, String nickname) {
        playerRepository.save(
                Player.builder()
                        .user(userRepository.findById(userId)
                                .orElseThrow(() -> new UserException(USER_NOT_FOUND)))
                        .quizRoom(quizRoomRepository.findById(roomId)
                                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND)))
                        .nickname(nickname)
                        .build());
    }
}
