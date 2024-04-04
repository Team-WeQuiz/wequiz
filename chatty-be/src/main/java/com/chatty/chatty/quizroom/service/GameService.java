package com.chatty.chatty.quizroom.service;

import com.chatty.chatty.quizroom.domain.RoomUsersStatus;
import com.chatty.chatty.quizroom.repository.RoomUsersStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameService {

    private final RoomUsersStatusRepository roomUsersStatusRepository;

    public RoomUsersStatus joinRoom(Long roomId, Long userId) {
        return roomUsersStatusRepository.addUserToRoom(roomId, userId);
    }
}
