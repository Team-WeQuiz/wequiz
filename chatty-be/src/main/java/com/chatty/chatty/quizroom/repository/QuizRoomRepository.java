package com.chatty.chatty.quizroom.repository;

import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface QuizRoomRepository extends JpaRepository<QuizRoom, Long> {

    Optional<QuizRoom> findByCode(String code);

    Page<QuizRoom> findByStatusOrderByCreatedAt(Status status, Pageable pageable);

    Long countByStatus(Status status);

    @Transactional
    @Modifying
    @Query("UPDATE QuizRoom q SET q.status = :status WHERE q.id = :id")
    void updateStatusById(Long id, Status status);

    List<QuizRoom> findByStatusAndCreatedAtBefore(Status status, LocalDateTime createdAt);
}
