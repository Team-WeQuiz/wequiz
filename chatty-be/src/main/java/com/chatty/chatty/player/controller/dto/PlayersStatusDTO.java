package com.chatty.chatty.player.controller.dto;

import com.chatty.chatty.player.domain.PlayerStatus;
import java.util.Set;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

@Builder
@Slf4j
public record PlayersStatusDTO(
        Long roomId,
        Set<PlayerStatus> playerStatuses
) {

}
