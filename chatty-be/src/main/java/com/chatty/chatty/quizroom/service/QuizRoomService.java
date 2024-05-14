package com.chatty.chatty.quizroom.service;

import static com.chatty.chatty.player.exception.PlayerExceptionType.PLAYER_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.FileExceptionType.FILE_INPUT_STREAM_FAILED;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.CODE_INVALID;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.NO_ROOM_FOUND_BY_CODE;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_FOUND;
import static com.chatty.chatty.quizroom.exception.QuizRoomExceptionType.ROOM_NOT_READY;

import com.chatty.chatty.common.util.RandomCodeGenerator;
import com.chatty.chatty.config.GlobalMessagingTemplate;
import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.game.controller.dto.dynamodb.MarkDTO;
import com.chatty.chatty.game.controller.dto.dynamodb.QuizDTO;
import com.chatty.chatty.game.repository.GameRepository;
import com.chatty.chatty.game.repository.PhaseRepository;
import com.chatty.chatty.game.repository.UserSubmitStatusRepository;
import com.chatty.chatty.game.repository.dynamodb.DynamoDBRepository;
import com.chatty.chatty.game.service.GameService;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.game.service.model.ModelService;
import com.chatty.chatty.player.domain.PlayersStatus;
import com.chatty.chatty.player.exception.PlayerException;
import com.chatty.chatty.player.repository.PlayerRepository;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.player.service.PlayerService;
import com.chatty.chatty.quizroom.controller.dto.CodeRequestDTO;
import com.chatty.chatty.quizroom.controller.dto.CreateRoomRequest;
import com.chatty.chatty.quizroom.controller.dto.ExistQuizListResponse;
import com.chatty.chatty.quizroom.controller.dto.QuizDocIdMLResponse;
import com.chatty.chatty.quizroom.controller.dto.QuizResultDTO;
import com.chatty.chatty.quizroom.controller.dto.QuizResultDTO.PlayerAnswer;
import com.chatty.chatty.quizroom.controller.dto.RoomAbstractDTO;
import com.chatty.chatty.quizroom.controller.dto.RoomDetailResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomIdResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomListResponse;
import com.chatty.chatty.quizroom.controller.dto.RoomResultResponse;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.entity.Status;
import com.chatty.chatty.quizroom.exception.FileException;
import com.chatty.chatty.quizroom.exception.QuizRoomException;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import com.chatty.chatty.user.service.UserService;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizRoomService {

    private static final Integer DEFAULT_PAGE_SIZE = 10;

    private final QuizRoomRepository quizRoomRepository;
    private final GameRepository gameRepository;
    private final GameService gameService;
    private final ModelService modelService;
    private final DynamoDBService dynamoDBService;
    private final DynamoDBRepository dynamoDBRepository;
    private final PlayerRepository playerRepository;
    private final MinioRepository minioRepository;
    private final PlayersStatusRepository playersStatusRepository;
    private final UserSubmitStatusRepository userSubmitStatusRepository;
    private final GlobalMessagingTemplate template;
    private final PlayerService playerService;
    private final PhaseRepository phaseRepository;
    private final UserService userService;

    public RoomListResponse getRooms(Integer page) {
        PageRequest pageRequest = PageRequest.of(page - 1, DEFAULT_PAGE_SIZE);
        List<RoomAbstractDTO> rooms = quizRoomRepository.findByStatusOrderByCreatedAt(Status.READY, pageRequest)
                .getContent()
                .stream()
                .filter(quizRoom -> playersStatusRepository.countPlayers(quizRoom.getId()) > 0)
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
        QuizRoom quizRoom = getQuizRoom(roomId);
        validateRoomIfReady(quizRoom.getStatus());
        gameService.sendDescription(quizRoom.getId(), userId);
        gameService.sendQuizReady(quizRoom.getId(), userId);

        return RoomDetailResponse.builder()
                .roomId(quizRoom.getId())
                .name(quizRoom.getName())
                .code(quizRoom.getCode())
                .maxPlayers(quizRoom.getPlayerLimitNum())
                .description(quizRoom.getDescription())
                .numOfQuiz(quizRoom.getNumOfQuiz())
                .isFull(playersStatusRepository.countPlayers(quizRoom.getId()) >= quizRoom.getPlayerLimitNum())
                .build();
    }

    public ExistQuizListResponse getExistQuizList(Long userId) {
        return new ExistQuizListResponse(dynamoDBRepository.getExistQuizList(userId));
    }

    public QuizRoom getQuizRoom(Long roomId) {
        return quizRoomRepository.findById(roomId)
                .orElseThrow(() -> new QuizRoomException(ROOM_NOT_FOUND));
    }

    public RoomIdResponse findRoomByCode(CodeRequestDTO request) {
        validateCode(request.code());
        QuizRoom quizRoom = quizRoomRepository.findByCode(request.code())
                .orElseThrow(() -> new QuizRoomException(NO_ROOM_FOUND_BY_CODE));
        if (quizRoom.getStatus() != Status.READY) {
            throw new QuizRoomException(ROOM_NOT_READY);
        }
        return RoomIdResponse.builder()
                .roomId(quizRoom.getId())
                .build();
    }

    public RoomResultResponse getTotalResult(Long roomId) {
        QuizRoom quizRoom = getQuizRoom(roomId);
        List<QuizDTO> quizDTOList = dynamoDBService.getAllQuiz(quizRoom.getQuizDocId());
        List<MarkDTO> markDTOList = dynamoDBService.getMark(quizRoom.getMarkDocId());

        List<QuizResultDTO> quizResultDTOList = new ArrayList<>();
        for (int quizIndex = 0; quizIndex < markDTOList.size(); quizIndex++) {
            QuizDTO quizDTO = quizDTOList.get(quizIndex);
            MarkDTO markDTO = markDTOList.get(quizIndex);

            // 유저별 답안 저장
            List<PlayerAnswer> playerAnswers = new ArrayList<>();
            for (int playerIndex = 0; playerIndex < markDTO.markeds().size(); playerIndex++) {
                MarkDTO.Marked marked = markDTO.markeds().get(playerIndex);
                log.info("playerId: {}", marked.playerId());
                log.info("playerAnswer: {}", marked.playerAnswer());

                // Player 엔티티에서 닉네임 가져오기
                String nickname = playerRepository.findByUserIdAndQuizRoomId(marked.playerId(), roomId)
                        .orElseThrow(() -> new PlayerException(PLAYER_NOT_FOUND))
                        .getNickname();
                String profileImage = userService.getProfileImageUrl(marked.playerId());
                playerAnswers.add(
                        new PlayerAnswer(marked.playerId(), nickname, profileImage, marked.playerAnswer(),
                                marked.marking()));
            }
            log.info("playerAnswers: {}", playerAnswers);

            // 정답률 계산
            int correctRate = calculateCorrectRate(playerAnswers);
            log.info("correctRate: {}", correctRate);

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
    public RoomIdResponse createRoom(CreateRoomRequest request, Long userId) {
        //6자리 랜덤 입장 코드 생성
        String code = generateQuizRoomCode();
        // 퀴즈룸 DB에 저장
        QuizRoom savedQuizRoom = quizRoomRepository.save(
                QuizRoom.builder()
                        .name(request.name())
                        .description(request.description())
                        .numOfQuiz(request.numOfQuiz())
                        .playerLimitNum(request.playerLimitNum())
                        .code(code)
                        .status(Status.READY)
                        .build()
        );

        log.info(request.existQuizDocId());
        // 기존 퀴즈로 진행하는 경우
        if (request.existQuizDocId() != null) {
            savedQuizRoom.setQuizDocId(request.existQuizDocId());
        } else {
            // minio에 파일(들) 업로드
            List<String> fileNames = uploadFilesToStorage(request, savedQuizRoom.getCreatedAt(), userId);

            // QuizDocId 저장
            QuizDocIdMLResponse mlResponse = modelService.requestQuizDocId(userId, savedQuizRoom, fileNames);
            savedQuizRoom.setQuizDocId(mlResponse.id());
        }
        quizRoomRepository.save(savedQuizRoom);

        return RoomIdResponse.builder()
                .roomId(savedQuizRoom.getId())
                .build();
    }

    private String generateQuizRoomCode() {
        String code;
        do {
            code = RandomCodeGenerator.generateCode();
        } while (quizRoomRepository.findByCode(code).isPresent());
        return code;
    }

    @Transactional
    public void startRoom(Long roomId) {
        quizRoomRepository.findById(roomId)
                .ifPresentOrElse(quizRoom
                        -> {
                    quizRoom.setPlayerNum(playersStatusRepository.countPlayers(quizRoom.getId()));
                    updateRoomStatus(quizRoom, Status.STARTED);
                    PlayersStatus players = playersStatusRepository.findByRoomId(roomId).get();
                    players.playerStatusSet()
                            .forEach(player -> playerService.savePlayer(player.userId(), roomId, player.nickname()));
                    userSubmitStatusRepository.init(players, roomId);
                }, () -> {
                    throw new QuizRoomException(ROOM_NOT_FOUND);
                });
    }

    @Transactional
    public void finishRoom(Long roomId) {
        quizRoomRepository.findById(roomId)
                .ifPresentOrElse(quizRoom
                        -> {
                    if (quizRoom.getStatus() == Status.FINISHED) {
                        return;
                    }
                    updateRoomStatus(quizRoom, Status.FINISHED);
                    gameRepository.clearQuizData(roomId);
                    playersStatusRepository.clear(roomId);
                    userSubmitStatusRepository.clear(roomId);
                    phaseRepository.clear(roomId);
                }, () -> {
                    throw new QuizRoomException(ROOM_NOT_FOUND);
                });
    }

    private void updateRoomStatus(QuizRoom quizRoom, Status status) {
        quizRoom.setStatus(status);
        quizRoomRepository.save(quizRoom);
    }

    public void broadcastUpdatedRoomList() {
        long totalPages = quizRoomRepository.countByStatus(Status.READY) / DEFAULT_PAGE_SIZE + 1;
        for (int page = 1; page <= totalPages; page++) {
            template.publishRoomList(page, getRooms(page));
        }
    }

    private List<String> uploadFilesToStorage(CreateRoomRequest request, LocalDateTime time, Long userId) {
        List<String> fileNames = new ArrayList<>();
        request.files()
                .forEach(file -> {
                    try {
                        String fileName = minioRepository.savePdf(userId, time, file.getInputStream());
                        fileNames.add(fileName);
                    } catch (IOException e) {
                        throw new FileException(FILE_INPUT_STREAM_FAILED);
                    }
                });
        return fileNames;
    }

    private void validateCode(String code) {
        if (code.length() != 6) {
            throw new QuizRoomException(CODE_INVALID);
        }
    }

    private int calculateCorrectRate(List<PlayerAnswer> playerAnswers) {
        int totalAnswers = playerAnswers.size();
        int correctCount = (int) playerAnswers.stream().filter(PlayerAnswer::marking).count();
        return totalAnswers > 0 ? (correctCount * 100) / totalAnswers : 0;
    }

    private void validateRoomIfReady(Status status) {
        if (status != Status.READY) {
            throw new QuizRoomException(ROOM_NOT_READY);
        }
    }
}
