package com.chatty.chatty.quizroom.service;

import static com.chatty.chatty.player.exception.PlayerExceptionType.PLAYER_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_READY;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_STARTED;

import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.game.controller.dto.dynamodb.MarkDTO;
import com.chatty.chatty.game.controller.dto.dynamodb.QuizDTO;
import com.chatty.chatty.game.repository.UserSubmitStatusRepository;
import com.chatty.chatty.game.service.GameService;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.game.service.model.ModelService;
import com.chatty.chatty.player.domain.PlayersStatus;
import com.chatty.chatty.player.exception.PlayerException;
import com.chatty.chatty.player.repository.PlayerRepository;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomResponse;
import com.chatty.chatty.quizroom.controller.dto.QuizDocIdMLResponse;
import com.chatty.chatty.quizroom.controller.dto.QuizResultDTO;
import com.chatty.chatty.quizroom.controller.dto.QuizResultDTO.PlayerAnswer;
import com.chatty.chatty.quizroom.controller.dto.RoomAbstractDTO;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomListResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomResultResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final DynamoDBService dynamoDBService;
    private final PlayerRepository playerRepository;
    private final MinioRepository minioRepository;
    private final PlayersStatusRepository playersStatusRepository;
    private final UserSubmitStatusRepository userSubmitStatusRepository;
    private final SimpMessagingTemplate template;


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

    public RoomResultResponse getTotalResult(Long roomId) {
        QuizRoom quizRoom = quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
        List<QuizDTO> quizDTOList = dynamoDBService.getAllQuiz(quizRoom.getQuizDocId(), quizRoom.getCreatedAt().toString());
        List<MarkDTO> markDTOList = dynamoDBService.getMark(quizRoom.getMarkDocId());

        List<QuizResultDTO> quizResultDTOList = new ArrayList<>();
        for (int quizIndex = 0; quizIndex < quizDTOList.size(); quizIndex++) {
            QuizDTO quizDTO = quizDTOList.get(quizIndex);
            MarkDTO markDTO = markDTOList.get(quizIndex);

            // 유저별 답안 저장
            List<PlayerAnswer> playerAnswers = new ArrayList<>();
            for (int playerIndex = 0; playerIndex < markDTO.markeds().size(); playerIndex++) {
                MarkDTO.Marked marked = markDTO.markeds().get(playerIndex);

                // Player 엔티티에서 닉네임 가져오기
                String nickname = playerRepository.findByUserIdAndQuizRoomId(marked.playerId(), roomId)
                        .orElseThrow(() -> new PlayerException(PLAYER_NOT_FOUND))
                        .getNickname();
                playerAnswers.add(new PlayerAnswer(marked.playerId(), nickname, marked.playerAnswer(), marked.marking()));
            }

            // 정답률 계산
            int correctRate = calculateCorrectRate(playerAnswers);

            quizResultDTOList.add(QuizResultDTO.builder()
                    .quizNumber(quizDTO.questionNumber())
                    .quiz(quizDTO.question())
                    .options(quizDTO.options())
                    .correct(quizDTO.correct())
                    .playerAnswers(playerAnswers)
                    .correctRate(correctRate)
                    .build());
        }

        return RoomResultResponse.builder()
                .results(quizResultDTOList)
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
                    if (quizRoom.getStatus() == Status.STARTED) {
                        return;
                    }
                    PlayersStatus players = playersStatusRepository.findByRoomId(roomId).get();
                    userSubmitStatusRepository.init(players, roomId);
                    validateRoomIfReady(quizRoom.getStatus());
                    updateRoomStatus(roomId, Status.STARTED);
                    savePlayersCount(quizRoom);
                }, () -> {
                    throw new QuizRoomException(ROOM_NOT_FOUND);
                });
    }

    public void finishRoom(Long roomId) {
        quizRoomRepository.findById(roomId)
                .ifPresentOrElse(quizRoom
                        -> {
                    if (quizRoom.getStatus() == Status.FINISHED) {
                        return;
                    }
                    validateRoomIfStarted(quizRoom.getStatus());
                    updateRoomStatus(roomId, Status.FINISHED);
                    playersStatusRepository.clear(roomId);
                    userSubmitStatusRepository.clear(roomId);
                }, () -> {
                    throw new QuizRoomException(ROOM_NOT_FOUND);
                });
    }

    private void savePlayersCount(QuizRoom quizRoom) {
        quizRoom.setPlayerNum(playersStatusRepository.countPlayers(quizRoom.getId()));
        quizRoomRepository.save(quizRoom);
    }

    private void updateRoomStatus(Long roomId, Status status) {
        quizRoomRepository.updateStatusById(roomId, status);
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

    private int calculateCorrectRate(List<PlayerAnswer> playerAnswers) {
        int totalAnswers = playerAnswers.size();
        int correctCount = 0;
        for (PlayerAnswer answer : playerAnswers) {
            if (answer.marking()) {
                correctCount++;
            }
        }
        return totalAnswers > 0 ? (correctCount * 100) / totalAnswers : 0;
    }
}
