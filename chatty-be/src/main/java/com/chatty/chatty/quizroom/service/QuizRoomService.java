package com.chatty.chatty.quizroom.service;

import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_READY;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_STARTED;

import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.game.service.GameService;
import com.chatty.chatty.game.service.model.ModelService;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.QuizDocIdMLResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomAbstractDTO;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomListResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizRoomService {

    private static final Integer DEFAULT_PAGE_SIZE = 10;
    private static final String BROADCAST_URL = "/sub/rooms?page=%d";

    private final QuizRoomRepository quizRoomRepository;
    private final GameService gameService;
    private final ModelService modelService;
    private final MinioRepository minioRepository;
    private final SimpMessagingTemplate template;
    private final PlayersStatusRepository playersStatusRepository;


    public RoomListResponse getRooms(Integer page) {
        PageRequest pageRequest = PageRequest.of(page - 1, DEFAULT_PAGE_SIZE);
        List<RoomAbstractDTO> rooms = quizRoomRepository.findByStatusOrderByCreatedAt(Status.READY, pageRequest)
                .getContent()
                .stream()
                .map(quizRoom -> RoomAbstractDTO.builder()
                        .roomId(quizRoom.getId())
                        .name(quizRoom.getName())
                        .description(quizRoom.getDescription())
                        .currentPlayers(playersStatusRepository.countPlayers(quizRoom.getId()))
                        .maxPlayers(quizRoom.getPlayerLimitNum())
                        .build())
                .toList();
        return RoomListResponse.builder()
                .rooms(rooms)
                .totalPages(quizRoomRepository.countByStatus(Status.READY) / DEFAULT_PAGE_SIZE + 1)
                .currentPage(Long.valueOf(page))
                .build();
    }

    public RoomDetailResponse getReadyRoomDetails(Long roomId, Long userId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        validateRoomIfReady(quizRoom.getStatus());
        gameService.sendDescription(quizRoom.getId(), userId);

        return RoomDetailResponse.builder()
                .roomId(quizRoom.getId())
                .name(quizRoom.getName())
                .maxPlayers(quizRoom.getPlayerLimitNum())
                .description(quizRoom.getDescription())
                .numOfQuiz(quizRoom.getNumOfQuiz())
                .build();
    }

    @Transactional
    public CreateRoomResponse createRoom(CreateRoomRequest request, Long userId) {
        // 퀴즈룸 DB에 저장
        QuizRoom savedQuizRoom = quizRoomRepository.save(
                QuizRoom.builder()
                        .name(request.name())
                        .description(request.description())
                        .numOfQuiz(request.numOfQuiz())
                        .playerLimitNum(request.playerLimitNum())
                        .code(request.code())
                        .status(Status.READY)
                        .build()
        );

        // minio에 파일(들) 업로드
        uploadFilesToStorage(request, savedQuizRoom.getCreatedAt(), userId);

        // QuizDocId 저장
        QuizDocIdMLResponse mlResponse = modelService.requestQuizDocId(userId, savedQuizRoom);
        savedQuizRoom.setQuizDocId(mlResponse.id());
        quizRoomRepository.save(savedQuizRoom);

        return CreateRoomResponse.builder()
                .roomId(savedQuizRoom.getId())
                .build();
    }

    public void startRoom(Long roomId) {
        quizRoomRepository.findById(roomId)
                .ifPresentOrElse(quizRoom
                        -> {
                    validateRoomIfReady(quizRoom.getStatus());
                    quizRoomRepository.updateStatusById(roomId, Status.STARTED);
                }, () -> {
                    throw new QuizRoomException(ROOM_NOT_FOUND);
                });
    }

    public void finishRoom(Long roomId) {
        quizRoomRepository.findById(roomId)
                .ifPresentOrElse(quizRoom
                        -> {
                    validateRoomIfStarted(quizRoom.getStatus());
                    updateRoomStatus(roomId);
                }, () -> {
                    throw new QuizRoomException(ROOM_NOT_FOUND);
                });
    }

    private void updateRoomStatus(Long roomId) {
        quizRoomRepository.updateStatusById(roomId, Status.FINISHED);
    }

    public void broadcastUpdatedRoomList() {
        long totalPages = quizRoomRepository.countByStatus(Status.READY) / DEFAULT_PAGE_SIZE + 1;
        for (int page = 1; page <= totalPages; page++) {
            template.convertAndSend(buildRoomListTopic(page), getRooms(page));
        }
    }

    private String buildRoomListTopic(int page) {
        return String.format(BROADCAST_URL, page);
    }

    private void uploadFilesToStorage(CreateRoomRequest request, LocalDateTime time, Long userId) {
        request.files()
                .forEach(file -> {
                    try {
                        minioRepository.saveFile(userId, time, file.getInputStream());
                    } catch (IOException e) {
                        throw new FileException(FILE_INPUT_STREAM_FAILED);
                    }
                });
    }

    private void validateRoomIfReady(Status status) {
        if (status != Status.READY) {
            throw new QuizRoomException(ROOM_NOT_READY);
        }
    }

    private void validateRoomIfStarted(Status status) {
        if (status != Status.STARTED) {
            throw new QuizRoomException(ROOM_NOT_STARTED);
        }
    }
}
