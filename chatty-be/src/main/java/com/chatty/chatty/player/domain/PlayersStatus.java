package com.chatty.chatty.player.domain;

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

    public PlayersStatus removeUser(Long userId) {
        playerStatusSet.removeIf(playerStatus -> playerStatus.userId().equals(userId));
        return new PlayersStatus(playerStatusSet);
    }

    public PlayersStatus toggleReady(Long userId) {
        playerStatusSet.stream()
                .filter(playerStatus -> playerStatus.userId().equals(userId))
                .findFirst()
                .ifPresent(playerStatus -> {
                    playerStatusSet.remove(playerStatus);
                    playerStatusSet.add(playerStatus.toggleReady());
                });
        return new PlayersStatus(playerStatusSet);
    }
}
