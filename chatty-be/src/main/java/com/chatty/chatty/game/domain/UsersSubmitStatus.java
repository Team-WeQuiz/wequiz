package com.chatty.chatty.game.domain;

import com.chatty.chatty.player.domain.PlayersStatus;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Builder;

@Builder
public record UsersSubmitStatus(

        Set<UserSubmitStatus> usersSubmitStatus
) {

    public static UsersSubmitStatus init() {
        return UsersSubmitStatus.builder()
                .usersSubmitStatus(ConcurrentHashMap.newKeySet())
                .build();
    }

    public UsersSubmitStatus addUsersInRoom(PlayersStatus players) {
        players.playerStatusSet().forEach(
                playerStatus -> usersSubmitStatus.add(
                        UserSubmitStatus.init(playerStatus.userId(), playerStatus.nickname(),
                                playerStatus.profileImage())
                ));
        return new UsersSubmitStatus(usersSubmitStatus);
    }

    public UsersSubmitStatus submit(Long userId) {
        usersSubmitStatus.stream()
                .filter(user -> user.userId().equals(userId))
                .findFirst()
                .ifPresent(status -> {
                    usersSubmitStatus.remove(status);
                    usersSubmitStatus.add(status.submit());
                });
        return new UsersSubmitStatus(usersSubmitStatus);
    }
}
