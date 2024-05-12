package com.chatty.chatty.game.service;

import static com.chatty.chatty.game.domain.Phase.COUNTDOWN;
import static com.chatty.chatty.game.domain.Phase.RESULT;

import com.chatty.chatty.common.util.ThreadSleep;
import com.chatty.chatty.game.controller.dto.CountDownResponse;
import com.chatty.chatty.game.controller.dto.DescriptionResponse;
import com.chatty.chatty.game.controller.dto.QuizReadyResponse;
import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.controller.dto.ScoreResponse;
import com.chatty.chatty.game.controller.dto.ScoreResponse.PlayerScoreDTO;
import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
import com.chatty.chatty.game.controller.dto.SubmitAnswerResponse;
import com.chatty.chatty.game.controller.dto.dynamodb.QuizDTO;
import com.chatty.chatty.game.controller.dto.model.MarkRequest;
import com.chatty.chatty.game.controller.dto.model.MarkRequest.AnswerDTO;
import com.chatty.chatty.game.controller.dto.model.MarkResponse;
import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.domain.AnswerData.PlayerAnswerData;
import com.chatty.chatty.game.domain.Phase;
import com.chatty.chatty.game.domain.QuizData;
import com.chatty.chatty.game.domain.ScoreData;
import com.chatty.chatty.game.domain.UserSubmitStatus;
import com.chatty.chatty.game.domain.UsersSubmitStatus;
import com.chatty.chatty.game.repository.AnswerRepository;
import com.chatty.chatty.game.repository.GameRepository;
import com.chatty.chatty.game.repository.PhaseRepository;
import com.chatty.chatty.game.repository.ScoreRepository;
import com.chatty.chatty.game.repository.UserSubmitStatusRepository;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.game.service.model.ModelService;
import com.chatty.chatty.player.controller.dto.NicknameRequest;
import com.chatty.chatty.player.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.player.domain.PlayersStatus;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.quizroom.entity.QuizRoom;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import com.chatty.chatty.user.service.UserService;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private static final Integer QUIZ_SIZE = 5;
    private static final Integer QUIZ_COUNT_SECONDS = 3;
    private static final Integer SCORE_COUNT_SECONDS = 7;

    private final QuizRoomRepository quizRoomRepository;
    private final PlayersStatusRepository playersStatusRepository;
    private final UserSubmitStatusRepository userSubmitStatusRepository;
    private final GameRepository gameRepository;
    private final AnswerRepository answerRepository;
    private final ScoreRepository scoreRepository;
    private final DynamoDBService dynamoDBService;
    private final ModelService modelService;
    private final SimpMessagingTemplate template;
    private final PhaseRepository phaseRepository;
    private final UserService userService;

    public PlayersStatusDTO joinRoom(Long roomId, Long userId, NicknameRequest request) {
        String profileImageUrl = userService.getProfileImageUrl(userId);
        PlayersStatus playersStatus = playersStatusRepository.saveUserToRoom(roomId, userId, request.nickname(),
                profileImageUrl);
        return buildDTO(roomId, playersStatus);
    }

    public PlayersStatusDTO leaveRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.leaveRoom(roomId, userId);
        return buildDTO(roomId, playersStatus);
    }

    public PlayersStatusDTO toggleReady(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.toggleReady(roomId, userId);
        return buildDTO(roomId, playersStatus);
    }

    private PlayersStatusDTO buildDTO(Long roomId, PlayersStatus playersStatus) {
        return PlayersStatusDTO.builder()
                .roomId(roomId)
                .playerStatuses(playersStatus.playerStatusSet())
                .build();
    }

    private synchronized void initQuiz(QuizData quizData) {
        if (quizData.getQuizDTOQueue().isEmpty() && quizData.getCurrentRound() < quizData.getTotalRound()) {
            fillQuiz(quizData);
            log.info("Fill: QuizQueue: {}", quizData.getQuizDTOQueue());
        }
    }

    public QuizResponse sendQuiz(Long roomId) {
        if (phaseRepository.getPhase(roomId) == RESULT) {
            return null;
        }
        QuizData quizData = gameRepository.getQuizData(roomId);
        initQuiz(quizData);
        log.info("Send: Quiz: {}", gameRepository.getQuizData(roomId).getQuiz());
        answerRepository.getAnswerData(roomId);
        return buildQuizResponse(quizData);
    }

    private void fillQuiz(QuizData quizData) {
        Integer currentRound = quizData.getCurrentRound();
        List<QuizDTO> quizDTOList = dynamoDBService.pollQuizzes(quizData.getQuizDocId(), quizData.getTimestamp(),
                currentRound, QUIZ_SIZE);
        List<QuizDTO> currentQuizzes = quizDTOList.subList(currentRound * QUIZ_SIZE, (currentRound + 1) * QUIZ_SIZE);
        quizData.fillQuiz(currentQuizzes);
        log.info("filled queue: {}", quizData.getQuizDTOQueue());
    }

    public QuizDTO removeQuiz(Long roomId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        log.info("Remove: QuizQueue: {}", quizData.getQuizDTOQueue());
        return quizData.removeQuiz();
    }

    /*
        subscription URL : /user/{userId}/queue/rooms/{roomId}/quizReady
    */
    @Async
    public void sendQuizReady(Long roomId, Long userId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        initQuiz(quizData);
        template.convertAndSendToUser(
                userId.toString(),
                "/queue/rooms/" + roomId + "/quizReady",
                QuizReadyResponse.builder()
                        .isReady(true)
                        .build()
        );
    }

    /*
        subscription URL : /user/{userId}/queue/rooms/{roomId}/description
     */
    @Async
    public void sendDescription(Long roomId, Long userId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        String description = dynamoDBService.pollDescription(quizData.getQuizDocId(), quizData.getTimestamp());
        DescriptionResponse descriptionResponse = DescriptionResponse.builder()
                .description(description)
                .build();
        log.info("디스크립션: {}", descriptionResponse);
        template.convertAndSendToUser(
                userId.toString(),
                "/queue/rooms/" + roomId + "/description",
                descriptionResponse
        );
    }

    private QuizResponse buildQuizResponse(QuizData quizData) {
        QuizDTO quiz = quizData.getQuiz();
        log.info("currentRound: {}", quizData.getCurrentRound());
        return QuizResponse.builder()
                .totalRound(quizData.getTotalRound())
                .currentRound(quizData.getCurrentRound())
                .quizNumber(quiz.questionNumber())
                .type(quiz.type())
                .quiz(quiz.question())
                .options(quiz.options())
                .build();
    }

    public void addPlayerAnswer(Long roomId, SubmitAnswerRequest request, Long userId) {
        // 플레이어 답안 맵에 답안 추가
        AnswerData answerData = answerRepository.getAnswerData(roomId);
        Boolean isMajority = answerData.addAnswer(userId, request);
        log.info("Add Answer: PlayerAnswers: {}", answerData.getPlayerAnswers());

        // 플레이어 제출 현황 갱신
        UsersSubmitStatus usersSubmitStatus = userSubmitStatusRepository.submit(roomId, userId);
        sendPlayersSubmitStatus(roomId, isMajority, usersSubmitStatus);
        int submitCount = (int) usersSubmitStatus.usersSubmitStatus().stream()
                .filter(UserSubmitStatus::isSolved)
                .count();

        // 과반수 제출일 때
        // 3초 카운트다운
        if (submitCount == answerData.getMajorityNum()) {
            phaseRepository.update(roomId, COUNTDOWN);
            log.info("Phase UPDATED: COUNTDOWN");
            quizCountDown(roomId, userId);
        }
    }

    private void markAndUpdateScore(Long roomId, QuizDTO solvedQuiz, AnswerData answerData) {
        // ML에 플레이어들 답안 넘겨서 채점 요청 후 채점 문서 id 저장
        QuizRoom quizRoom = quizRoomRepository.findById(roomId).get();
        MarkResponse markResponse = modelService.requestMark(MarkRequest.builder()
                .id(quizRoom.getQuizDocId())
                .quiz_id(solvedQuiz.id())
                .question_number(answerData.getQuizNum())
                .correct(solvedQuiz.correct())
                .answers(getAnswers(answerData.getPlayerAnswers()))
                .build());
        if (quizRoom.getMarkDocId() == null) {
            quizRoom.setMarkDocId(markResponse.id());
            quizRoomRepository.save(quizRoom);
        }

        // 점수 갱신
        ScoreData scoreData = scoreRepository.getScoreData(roomId);
        scoreData.addScore(answerData, markResponse.answers());
        log.info("Updated Score");
    }

    private void resetState(Long roomId) {
        // 직전 문제 삭제
        removeQuiz(roomId);
        QuizData quizData = gameRepository.getQuizData(roomId);
        if (quizData.isQueueEmpty()) {
            phaseRepository.update(roomId, RESULT);
            log.info("Phase UPDATED: RESULT");
        } else {
            phaseRepository.update(roomId, Phase.QUIZ_SOLVING);
            log.info("Phase UPDATED: QUIZ_SOLVING");
        }
        // 플레이어 제출 상태, 답안 맵 초기화
        PlayersStatus players = playersStatusRepository.findByRoomId(roomId).get();
        userSubmitStatusRepository.init(players, roomId);
        sendPlayersSubmitStatus(roomId, false, userSubmitStatusRepository.findByRoomId(roomId));
        answerRepository.clearAnswerData(roomId);
        log.info("Reset");
    }

    private void quizCountDown(Long roomId, Long userId) {
        Integer seconds = QUIZ_COUNT_SECONDS;
        while (seconds >= 0) {
            log.info("Countdown: {}", seconds);
            template.convertAndSend("/sub/rooms/" + roomId + "/quizCount",
                    buildCountDownResponse(seconds));
            ThreadSleep.sleep(1000L);
            seconds--;
        }
        // seconds == -1
        // 제출 안 한애들 빈값으로 제출 처리
        AnswerData answerData = answerRepository.getAnswerData(roomId);
        UsersSubmitStatus usersSubmitStatus = userSubmitStatusRepository.findByRoomId(roomId);
        usersSubmitStatus.usersSubmitStatus().stream()
                .filter(userSubmitStatus -> !userSubmitStatus.isSolved())
                .forEach(userSubmitStatus -> {
                    answerData.addAnswer(userSubmitStatus.userId(),
                            SubmitAnswerRequest.builder().playerAnswer("").build());
                    userSubmitStatus.submit();
                });
        // 퀴즈 끝났으면 다음 퀴즈 반환 준비
        QuizDTO solvedQuiz = gameRepository.getQuizData(roomId).getQuiz();
        log.info("Answer All Submitted: PlayerAnswers: {}", answerData.getPlayerAnswers());
        markAndUpdateScore(roomId, solvedQuiz, answerData);
        resetState(roomId);
        template.convertAndSend("/sub/rooms/" + roomId + "/quizCount",
                buildCountDownResponse(seconds));
        log.info("Countdown: {}", seconds);
        if (phaseRepository.getPhase(roomId) == RESULT) {
            getPhase(roomId, userId);
            scoreCountDown(roomId);
        }
    }

    private void scoreCountDown(Long roomId) {
        Integer seconds = SCORE_COUNT_SECONDS;
        do {
            template.convertAndSend("/sub/rooms/" + roomId + "/scoreCount",
                    buildCountDownResponse(seconds));
            ThreadSleep.sleep(1000L);
            seconds--;
        }
        while (seconds >= 0);
    }

    private CountDownResponse buildCountDownResponse(Integer second) {
        return CountDownResponse.builder()
                .second(second)
                .build();
    }

    private void sendPlayersSubmitStatus(Long roomId, Boolean isMajority, UsersSubmitStatus status) {
        template.convertAndSend("/sub/rooms/" + roomId + "/submit", SubmitAnswerResponse.builder()
                .isMajority(isMajority)
                .timestamp(LocalDateTime.now())
                .submitStatuses(status.usersSubmitStatus())
                .build());
    }

    private List<AnswerDTO> getAnswers(Map<Long, PlayerAnswerData> playerAnswers) {
        return playerAnswers.entrySet().stream()
                .map(entry -> AnswerDTO.builder()
                        .user_id(entry.getKey())
                        .user(entry.getValue().playerAnswer())
                        .build())
                .toList();
    }

    public ScoreResponse sendScore(Long roomId) {
        ScoreData scoreData = scoreRepository.getScoreData(roomId);
        List<PlayerScoreDTO> scores = scoreData.getPlayersScore().entrySet().stream()
                .map(entry -> PlayerScoreDTO.builder()
                        .playerId(entry.getKey())
                        .nickname(entry.getValue().getNickname())
                        .profileImage(entry.getValue().getProfileImage())
                        .score(entry.getValue().getScore())
                        .build())
                .sorted(Comparator.comparing(PlayerScoreDTO::score).reversed())
                .toList();
        return ScoreResponse.builder()
                .scores(scores)
                .build();
    }

    private SubmitAnswerResponse getSubmitAnswerResponse(Long roomId) {
        AnswerData answerData = answerRepository.getAnswerData(roomId);
        UsersSubmitStatus usersSubmitStatus = userSubmitStatusRepository.findByRoomId(roomId);
        return SubmitAnswerResponse.builder()
                .isMajority(answerData.checkSubmitStatus())
                .timestamp(LocalDateTime.now())
                .submitStatuses(usersSubmitStatus.usersSubmitStatus())
                .build();
    }

    public void getPhase(Long roomId, Long userId) {
        Phase currentPhase = phaseRepository.getPhase(roomId);
        QuizResponse quizResponse = sendQuiz(roomId);
        switch (currentPhase) {
            case QUIZ_SOLVING, COUNTDOWN -> {
                template.convertAndSendToUser(
                        userId.toString(),
                        "/queue/rooms/" + roomId + "/quiz",
                        quizResponse
                );
                template.convertAndSend(
                        "/sub/rooms/" + roomId + "/submit",
                        getSubmitAnswerResponse(roomId)
                );
            }
            case RESULT -> {
                ScoreResponse scoreResponse = sendScore(roomId);
                template.convertAndSend("/sub/rooms/" + roomId + "/score",
                        scoreResponse
                );
            }
        }
    }
}