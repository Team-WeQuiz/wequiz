package com.chatty.chatty.quizroom.service;

import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_FINISHED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_STARTED;

import com.chatty.chatty.model.controller.dto.MakeQuizRequest;
import com.chatty.chatty.model.controller.dto.MakeQuizResponse;
import com.chatty.chatty.model.service.ModelService;
import com.chatty.chatty.quizroom.controller.dto.LobbyResponse;
import com.chatty.chatty.quizroom.controller.dto.MakeRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.MakeRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.QuizResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
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

    public List<QuizRoom> findAll() {
        return quizRoomRepository.findAll();
    }

    public LobbyResponse findLobby(Long id) {
        QuizRoom quizRoom = quizRoomRepository.findById(id)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        isRoomStarted(quizRoom.getStatus());
        isRoomFinished(quizRoom.getStatus());

        Long quizDocId = quizRoom.getQuizDocId();
        // TODO: noSQL db에서 description 읽어오는 코드
        String description = "example_description";

        return LobbyResponse.builder()
                .id(quizRoom.getId())
                .name(quizRoom.getName())
                .timeLimit(quizRoom.getTimeLimit())
                .playerLimitNum(quizRoom.getPlayerLimitNum())
                .description(description)
                .build();
    }

    public QuizResponse findQuiz(Long id) {
        QuizRoom quizRoom = quizRoomRepository.findById(id)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        isRoomFinished(quizRoom.getStatus());

        Long quizDocId = quizRoom.getQuizDocId();
        // TODO: noSQL db에서 questions 읽어오는 코드
        List<?> questions = Arrays.asList("questionId:1, ...", "questionId:2, ...");

        return QuizResponse.builder()
                .id(quizRoom.getId())
                .name(quizRoom.getName())
                .numOfQuiz(quizRoom.getNumOfQuiz())
                .timeLimit(quizRoom.getTimeLimit())
                .playerNum(quizRoom.getPlayerNum())
                .questions(questions)
                .build();
    }

    @Transactional
    public MakeRoomResponse makeRoom(MakeRoomRequest request) {
        log.info("request : {}", request);
        QuizRoom newQuizRoom = QuizRoom.builder()
                .name(request.name())
                .numOfQuiz(request.numOfQuiz())
                .timeLimit(request.timeLimit())
                .playerLimitNum(request.playerLimitNum())
                .code(request.code())
                .build();
        QuizRoom savedQuizRoom = quizRoomRepository.save(newQuizRoom);

        MakeQuizRequest makeQuizRequest = MakeQuizRequest.builder()
                .roomId(savedQuizRoom.getId())
                .numOfQuiz(request.numOfQuiz())
                .type(request.type())
                .files(request.files())
                .build();
        MakeQuizResponse makeQuizResponse = modelService.makeQuiz(makeQuizRequest);
        savedQuizRoom.setQuizDocId(makeQuizResponse.quizDocId());

        return MakeRoomResponse.builder()
                .roomId(savedQuizRoom.getId())
                .build();
    }

    private void isRoomStarted(Status status) {
        if (status == Status.STARTED) {
            throw new QuizRoomException(ROOM_STARTED);
        }
    }

    private void isRoomFinished(Status status) {
        if (status == Status.FINISHED) {
            throw new QuizRoomException(ROOM_FINISHED);
        }
    }
}
