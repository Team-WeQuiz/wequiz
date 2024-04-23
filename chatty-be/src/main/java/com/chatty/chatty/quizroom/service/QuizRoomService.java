package com.chatty.chatty.quizroom.service;

import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_FINISHED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_STARTED;

import com.chatty.chatty.common.util.Sha256Encrypt;
import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.game.service.model.ModelService;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.QuizDocIdMLResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomQuizResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizRoomService {

    private final QuizRoomRepository quizRoomRepository;
    private final ModelService modelService;
    private final MinioRepository minioRepository;

    public List<QuizRoom> getRooms() {
        return quizRoomRepository.findAll();
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
                        .numOfQuiz(request.numOfQuiz())
                        .timeLimit(request.timeLimit())
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
