package com.chatty.chatty.quizroom.repository;

import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRoomRepository extends JpaRepository<QuizRoom, Long> {

    Page<QuizRoom> findByStatusOrderByCreatedAt(Status status, Pageable pageable);
}
