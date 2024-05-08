package com.chatty.chatty.player.repository;

import com.chatty.chatty.player.domain.entity.Player;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Page<Player> findByUserIdOrderByCreatedAt(Long userId, Pageable pageable);

    void deleteByUserIdAndQuizRoomId(Long userId, Long roomId);
}
