package com.chatty.chatty.player.repository;

import com.chatty.chatty.player.domain.entity.Player;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByUserIdAndQuizRoomId(Long userId, Long roomId);

    Page<Player> findByUserIdOrderByCreatedAt(Long userId, Pageable pageable);
}
