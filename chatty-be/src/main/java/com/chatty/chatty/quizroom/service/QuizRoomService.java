package com.chatty.chatty.quizroom.service;

import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_FINISHED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_STARTED;

import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.game.service.model.ModelService;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomAbstractDTO;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomListResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomQuizResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.io.IOException;
import java.util.Arrays;
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

    private final QuizRoomRepository quizRoomRepository;
    private final ModelService modelService;
    private final MinioRepository minioRepository;
    private final SimpMessagingTemplate template;
    private final PlayersStatusRepository playersStatusRepository;

    private static final Integer DEFAULT_PAGE_SIZE = 10;

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

    public RoomDetailResponse getRoomDetail(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        validateRoomStatus(quizRoom.getStatus());
//        Long quizDocId = quizRoom.getQuizDocId();
        // TODO: noSQL db에서 description 읽어오는 코드
        String description = "example_description";

        return RoomDetailResponse.builder()
                .roomId(quizRoom.getId())
                .name(quizRoom.getName())
                .timeLimit(quizRoom.getTimeLimit())
                .playerLimitNum(quizRoom.getPlayerLimitNum())
                .description(description)
                .build();
    }

    public RoomQuizResponse getRoomQuiz(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        validateRoomFinished(quizRoom.getStatus());

//        Long quizDocId = quizRoom.getQuizDocId();
        // TODO: noSQL db에서 questions 읽어오는 코드
        List<?> questions = Arrays.asList("questionId:1, ...", "questionId:2, ...");

        return RoomQuizResponse.builder()
                .roomId(quizRoom.getId())
                .name(quizRoom.getName())
                .numOfQuiz(quizRoom.getNumOfQuiz())
                .timeLimit(quizRoom.getTimeLimit())
                .playerNum(quizRoom.getPlayerNum())
                .questions(questions)
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
                        .timeLimit(request.timeLimit())
                        .playerLimitNum(request.playerLimitNum())
                        .code(request.code())
                        .status(Status.READY)
                        .build()
        );

        // minio에 파일(들) 업로드
        uploadFilesToStorage(request, userId);

        // QuizDocId 저장
        savedQuizRoom.setQuizDocId(modelService.requestQuizDocId(userId, savedQuizRoom));
        quizRoomRepository.save(savedQuizRoom);

        // 방 목록 업데이트 소켓 메세지 전송
        broadcastUpdatedRoomList();

        return CreateRoomResponse.builder()
                .roomId(savedQuizRoom.getId())
                .build();
    }

    private void broadcastUpdatedRoomList() {
        long totalPages = quizRoomRepository.countByStatus(Status.READY) / DEFAULT_PAGE_SIZE + 1;
        for (int page = 1; page <= totalPages; page++) {
            template.convertAndSend(buildRoomListTopic(page), getRooms(page));
        }
    }

    private String buildRoomListTopic(int page) {
        return String.format("/sub/rooms?page=%d", page);
    }

    private void uploadFilesToStorage(CreateRoomRequest request, Long userId) {
        request.files()
                .forEach(file -> {
                    try {
                        minioRepository.saveFile(userId, file.getInputStream());
                    } catch (IOException e) {
                        throw new FileException(FILE_INPUT_STREAM_FAILED);
                    }
                });
    }

    private void validateRoomStatus(Status status) {
        validateRoomStarted(status);
        validateRoomFinished(status);
    }

    private void validateRoomStarted(Status status) {
        if (status == Status.STARTED) {
            throw new QuizRoomException(ROOM_STARTED);
        }
    }

    private void validateRoomFinished(Status status) {
        if (status == Status.FINISHED) {
            throw new QuizRoomException(ROOM_FINISHED);
        }
    }
}
