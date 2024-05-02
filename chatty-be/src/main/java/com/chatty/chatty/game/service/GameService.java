package com.chatty.chatty.game.service;

import com.chatty.chatty.common.dto.CommonMessageDTO;
import com.chatty.chatty.game.controller.dto.DescriptionResponse;
import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
import com.chatty.chatty.game.controller.dto.SubmitAnswerResponse;
import com.chatty.chatty.game.domain.UserSubmitStatus;
import com.chatty.chatty.game.controller.dto.dynamodb.Quiz;
import com.chatty.chatty.game.controller.dto.model.MarkRequest;
import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.domain.QuizData;
import com.chatty.chatty.game.domain.SubmitStatus;
import com.chatty.chatty.game.domain.UsersSubmitStatus;
import com.chatty.chatty.game.repository.AnswerRepository;
import com.chatty.chatty.game.repository.GameRepository;
import com.chatty.chatty.game.repository.UserSubmitStatusRepository;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.game.service.model.ModelService;
import com.chatty.chatty.player.controller.dto.NicknameRequest;
import com.chatty.chatty.player.controller.dto.PlayersStatusDTO;
import com.chatty.chatty.player.domain.PlayersStatus;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import java.time.LocalDateTime;
import java.util.List;
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

    private final PlayersStatusRepository playersStatusRepository;
    private final UserSubmitStatusRepository userSubmitStatusRepository;
    private final GameRepository gameRepository;
    private final AnswerRepository answerRepository;
    private final DynamoDBService dynamoDBService;
    private final ModelService modelService;
    private final SimpMessagingTemplate template;

    public PlayersStatusDTO joinRoom(Long roomId, Long userId, NicknameRequest request) {
        PlayersStatus playersStatus = playersStatusRepository.saveUserToRoom(roomId, userId, request.nickname());
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

    public CommonMessageDTO startGame(Long roomId) {
        PlayersStatus players = playersStatusRepository.findByRoomId(roomId).get();
        userSubmitStatusRepository.init(players, roomId);
        return CommonMessageDTO.builder()
                .message(roomId + "번 방의 게임이 시작되었습니다.")
                .build();
    }

    public CommonMessageDTO endGame(Long roomId) {
        playersStatusRepository.clear(roomId);
        userSubmitStatusRepository.clear(roomId);
        return CommonMessageDTO.builder()
                .message(roomId + "번 방의 게임이 종료되었습니다.")
                .build();
    }


    private PlayersStatusDTO buildDTO(Long roomId, PlayersStatus playersStatus) {
        return PlayersStatusDTO.builder()
                .roomId(roomId)
                .playerStatuses(playersStatus.playerStatusSet())
                .build();
    }

    public QuizResponse sendQuiz(Long roomId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        if (quizData.getQuizQueue().isEmpty() && quizData.getCurrentRound() < quizData.getTotalRound()) {
            fillQuiz(quizData);
            log.info("Fill: QuizQueue: {}", quizData.getQuizQueue());
        }
        log.info("Send: Quiz: {}", quizData.getQuiz());
        return buildQuizResponse(quizData);
    }

    @Async
    protected void fillQuiz(QuizData quizData) {
        Integer currentRound = quizData.getCurrentRound();
        List<Quiz> quizzes = dynamoDBService.pollQuizzes(quizData.getQuizDocId(), quizData.getTimestamp(),
                currentRound, QUIZ_SIZE);
        List<Quiz> currentQuizzes = quizzes.subList(currentRound * QUIZ_SIZE, (currentRound + 1) * QUIZ_SIZE);
        quizData.fillQuiz(currentQuizzes);
        log.info("filled queue: {}", quizData.getQuizQueue());
    }

    public Quiz removeQuiz(Long roomId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        log.info("Remove: QuizQueue: {}", quizData.getQuizQueue());
        return quizData.removeQuiz();
    }

    /*
        subscription URL : /user/{userId}/queue/rooms/{roodId}/description
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
        Quiz quiz = quizData.getQuiz();
        return QuizResponse.builder()
                .totalRound(quizData.getTotalRound())
                .currentRound(quizData.getCurrentRound())
                .quizNumber(quiz.questionNumber())
                .type(quiz.type())
                .quiz(quiz.question())
                .options(quiz.options())
                .build();
    }

    public SubmitAnswerResponse addPlayerAnswer(Long roomId, SubmitAnswerRequest request, Long userId) {
        AnswerData answerData = answerRepository.getAnswerData(roomId, request.quizNum());
        SubmitStatus status = answerData.addAnswer(userId, request.playerAnswer());
        log.info("Add Answer: PlayerAnswers: {}", answerData.getPlayerAnswers());
        UsersSubmitStatus submitStatus = userSubmitStatusRepository.submit(roomId, userId);

        if (status == SubmitStatus.ALL_SUBMITTED) {
            Quiz removedQuiz = removeQuiz(roomId);
            String quizDocId = gameRepository.getQuizData(roomId).getQuizDocId();
            modelService.requestMark(MarkRequest.builder()
                    .id(quizDocId)
                    .quiz_id(removedQuiz.id())
                    .question_number(answerData.getQuizNum())
                    .correct(removedQuiz.correct())
                    .answers(answerData.getPlayerAnswers())
                    .build());
            calculateScore();
            answerRepository.clearAnswerData(roomId);
        }
        return SubmitAnswerResponse.builder()
                .status(status)
                .timestamp(LocalDateTime.now())
                .submitStatuses(submitStatus.usersSubmitStatus())
                .build();
    }

    private void calculateScore() {
        // TODO: 점수 계산
    }
}
