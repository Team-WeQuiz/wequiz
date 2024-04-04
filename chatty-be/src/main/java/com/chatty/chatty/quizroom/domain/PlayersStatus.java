package com.chatty.chatty.quizroom.domain;

import com.chatty.chatty.quizroom.controller.dto.PlayerStatus;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

@Builder
@Slf4j
public record PlayersStatus(
        Long roomId,
        Set<PlayerStatus> playerStatuses
) {

    public PlayersStatus join(Long userId) {
        Set<PlayerStatus> newPlayerStatuses = ConcurrentHashMap.newKeySet();
        newPlayerStatuses.addAll(playerStatuses);
        newPlayerStatuses.add(PlayerStatus.createStatus(userId));
        return new PlayersStatus(roomId, newPlayerStatuses);
    }
}
