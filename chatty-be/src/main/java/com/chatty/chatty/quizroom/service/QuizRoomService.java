package com.chatty.chatty.quizroom.service;

import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_FINISHED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_STARTED;

import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.model.service.ModelService;
import com.chatty.chatty.quizroom.controller.dto.GenerateQuizMLResponse;
import com.chatty.chatty.quizroom.controller.dto.MakeRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.MakeRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomQuizResponse;
import com.chatty.chatty.quizroom.domain.entity.QuizRoom;
import com.chatty.chatty.quizroom.domain.entity.Status;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.io.IOException;
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
    public MakeRoomResponse makeRoom(MakeRoomRequest request, Long userId) {
        QuizRoom newQuizRoom = QuizRoom.builder()
                .name(request.name())
                .numOfQuiz(request.numOfQuiz())
                .timeLimit(request.timeLimit())
                .playerLimitNum(request.playerLimitNum())
                .code(request.code())
                .status(Status.READY)
                .build();
        QuizRoom savedQuizRoom = quizRoomRepository.save(newQuizRoom);

        List<String> fileNames = request.files().stream()
                .map(file -> {
                    try {
                        return minioRepository.saveFile(userId, file.getInputStream());
                    } catch (IOException e) {
                        throw new FileException(FILE_INPUT_STREAM_FAILED);
                    }
                })
                .toList();
        GenerateQuizMLResponse generateQuizMLResponse = modelService.makeQuiz(userId, savedQuizRoom, fileNames);
        savedQuizRoom.setQuizDocId(generateQuizMLResponse.id());
        quizRoomRepository.save(savedQuizRoom);
        return MakeRoomResponse.builder()
                .description(generateQuizMLResponse.description())
                .build();
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
