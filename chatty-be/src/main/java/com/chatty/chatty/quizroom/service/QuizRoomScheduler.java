package com.chatty.chatty.quizroom.service;

import com.chatty.chatty.quizroom.entity.Status;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuizRoomScheduler {

    private final QuizRoomService quizRoomService;
    private final QuizRoomRepository quizRoomRepository;

    @Scheduled(fixedDelay = 1000 * 60 * 10)
    public void checkRoomStatusAfterTimeout() {
        log.info("스케쥴러 실행");
        quizRoomRepository.findByStatusAndCreatedAtBefore(Status.READY, LocalDateTime.now().minusMinutes(10))
                .forEach(quizRoom -> {
                    log.info("{}번 퀴즈방 시간초과 -> 스케쥴러 실행", quizRoom.getId());
                    quizRoomService.finishRoom(quizRoom.getId());
                });
        log.info("스케쥴러 종료");
    }
}
