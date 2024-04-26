package com.chatty.chatty.game.service;

import com.chatty.chatty.game.controller.dto.DescriptionResponse;
import com.chatty.chatty.game.controller.dto.QuizResponse;
import com.chatty.chatty.game.controller.dto.SubmitAnswerRequest;
import com.chatty.chatty.game.controller.dto.SubmitAnswerResponse;
import com.chatty.chatty.game.controller.dto.dynamodb.Quiz;
import com.chatty.chatty.game.controller.dto.model.MarkRequest;
import com.chatty.chatty.game.domain.AnswerData;
import com.chatty.chatty.game.domain.QuizData;
import com.chatty.chatty.game.domain.SubmitStatus;
import com.chatty.chatty.game.repository.AnswerRepository;
import com.chatty.chatty.game.repository.GameRepository;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.game.service.model.ModelService;
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
    private static final Long QUIZ_POLLING_SLEEP_TIME = 5000L;
    private final PlayersStatusRepository playersStatusRepository;
    private final GameRepository gameRepository;
    private final AnswerRepository answerRepository;
    private final DynamoDBService dynamoDBService;
    private final ModelService modelService;
    private final SimpMessagingTemplate template;

    public PlayersStatusDTO joinRoom(Long roomId, Long userId) {
        PlayersStatus playersStatus = playersStatusRepository.saveUserToRoom(roomId, userId);
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

    public void endGame(Long roomId) {
        playersStatusRepository.clear(roomId);
    }

    private PlayersStatusDTO buildDTO(Long roomId, PlayersStatus playersStatus) {
        return PlayersStatusDTO.builder()
                .roomId(roomId)
                .playerStatuses(playersStatus.playerStatusSet())
                .build();
    }

    @Async
    public void initQuiz(Long roomId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        fillQuiz(quizData);
    }

    public QuizResponse sendQuiz(Long roomId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        if (quizData.getQuizQueue().isEmpty()) {
            fillQuiz(quizData);
            quizData.increaseCurrentRound();
            log.info("Fill: QuizData: {}", quizData);
        }
        log.info("Send: QuizData: {}", quizData);
        return buildQuizResponse(quizData);
    }

    @Async
    private void fillQuiz(QuizData quizData) {
        Integer currentRound = quizData.getCurrentRound();
        List<Quiz> quizzes = dynamoDBService.pollQuizzes(quizData.getQuizDocId(), quizData.getTimestamp(),
                currentRound, QUIZ_SIZE);
        List<Quiz> currentQuizzes = quizzes.subList(currentRound * QUIZ_SIZE, (currentRound + 1) * QUIZ_SIZE);
        quizData.getQuizQueue().addAll(currentQuizzes);
        log.info("filled queue: {}", quizData);
    }

    public void removeQuiz(Long roomId) {
        QuizData quizData = gameRepository.getQuizData(roomId);
        quizData.getQuizQueue().poll();
        log.info("Remove: QuizData: {}", quizData);
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
        Quiz quiz = quizData.getQuizQueue().peek();
        return QuizResponse.builder()
                .quiz(quiz)
                .totalRound(quizData.getTotalRound())
                .currentRound(quizData.getCurrentRound() + 1)
                .build();
    }

    public SubmitAnswerResponse addPlayerAnswer(Long roomId, SubmitAnswerRequest request) {
        SubmitStatus status = answerRepository.addPlayerAnswer(roomId, request);
        log.info("Add: AnswerData: {}", answerRepository.getAnswerData(roomId, request));

        if (status == SubmitStatus.ALL_SUBMITTED) {
            removeQuiz(roomId);

            String quizDocId = gameRepository.getQuizData(roomId).getQuizDocId();
            AnswerData answerData = answerRepository.getAnswerData(roomId, request);
            modelService.requestMark(MarkRequest.builder()
                    .id(quizDocId)
                    .quiz_id(answerData.getQuizId())
                    .question_number(answerData.getQuizNum())
                    .correct(answerData.getAnswer())
                    .answers(answerData.getPlayerAnswers())
                    .build());
            calculateScore();
            answerRepository.clearAnswer(roomId);
        }
        return SubmitAnswerResponse.builder()
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
    }

    private void calculateScore() {
        // TODO: 점수 계산
    }
}
