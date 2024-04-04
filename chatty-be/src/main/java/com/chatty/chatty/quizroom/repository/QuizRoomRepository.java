package com.chatty.chatty.quizroom.repository;

import com.chatty.chatty.quizroom.domain.entity.QuizRoom;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRoomRepository extends JpaRepository<QuizRoom, Long> {

    List<QuizRoom> findAll();

    Optional<QuizRoom> findById(Long id);

}
