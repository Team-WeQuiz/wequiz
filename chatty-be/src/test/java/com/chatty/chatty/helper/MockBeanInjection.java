package com.chatty.chatty.helper;

import com.chatty.chatty.auth.jwt.JwtUtil;
import com.chatty.chatty.auth.service.AuthService;
import com.chatty.chatty.auth.support.AuthenticationContext;
import com.chatty.chatty.auth.support.AuthenticationExtractor;
import com.chatty.chatty.config.minio.MinioRepository;
import com.chatty.chatty.game.repository.AnswerRepository;
import com.chatty.chatty.game.repository.GameRepository;
import com.chatty.chatty.game.repository.PhaseRepository;
import com.chatty.chatty.game.repository.ScoreRepository;
import com.chatty.chatty.game.repository.UserSubmitStatusRepository;
import com.chatty.chatty.game.service.GameService;
import com.chatty.chatty.game.service.dynamodb.DynamoDBService;
import com.chatty.chatty.player.repository.PlayerRepository;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import com.chatty.chatty.player.service.PlayerService;
import com.chatty.chatty.quizroom.repository.QuizRoomRepository;
import com.chatty.chatty.quizroom.service.QuizRoomService;
import com.chatty.chatty.user.repository.UserRepository;
import com.chatty.chatty.user.service.UserService;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;

@MockBean(JpaMetamodelMappingContext.class)
public class MockBeanInjection {

    @MockBean
    protected AuthService authService;

    @MockBean
    protected AuthenticationContext authenticationContext;

    @MockBean
    protected AuthenticationExtractor authenticationExtractor;

    @MockBean
    protected JwtUtil jwtUtil;

    @MockBean
    protected MinioRepository minioRepository;

    @MockBean
    protected AnswerRepository answerRepository;

    @MockBean
    protected GameRepository gameRepository;

    @MockBean
    protected PhaseRepository phaseRepository;

    @MockBean
    protected ScoreRepository scoreRepository;

    @MockBean
    protected UserSubmitStatusRepository userSubmitStatusRepository;

    @MockBean
    protected DynamoDBService dynamoDBService;

    @MockBean
    protected GameService gameService;

    @MockBean
    protected PlayerRepository playerRepository;

    @MockBean
    protected PlayersStatusRepository playersStatusRepository;

    @MockBean
    protected PlayerService playerService;

    @MockBean
    protected QuizRoomRepository quizRoomRepository;

    @MockBean
    protected QuizRoomService quizRoomService;

    @MockBean
    protected UserRepository userRepository;

    @MockBean
    protected UserService userService;
}
