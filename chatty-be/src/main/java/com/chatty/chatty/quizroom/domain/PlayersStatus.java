package com.chatty.chatty.quizroom.domain;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

@Builder
@Slf4j
public record PlayersStatus(
        Set<PlayerStatus> playerStatusSet
) {

    public static PlayersStatus init() {
        return PlayersStatus.builder()
                .playerStatusSet(ConcurrentHashMap.newKeySet())
                .build();
    }

    public PlayersStatus updateWithNewUser(Long userId) {
        playerStatusSet.add(PlayerStatus.initNewUser(userId));
        return new PlayersStatus(playerStatusSet);
    }
}
