package com.chatty.chatty.game.service.dynamodb;

import static com.chatty.chatty.common.util.ThreadSleep.sleep;
import static com.chatty.chatty.game.exception.GameExceptionType.FAILED_TO_FETCH_DESCRIPTION;
import static com.chatty.chatty.game.exception.GameExceptionType.FAILED_TO_FETCH_QUIZ;

import com.chatty.chatty.game.controller.dto.dynamodb.MarkDTO;
import com.chatty.chatty.game.controller.dto.dynamodb.MarkDTO.Marked;
import com.chatty.chatty.game.controller.dto.dynamodb.QuizDTO;
import com.chatty.chatty.game.exception.GameException;
import com.chatty.chatty.game.repository.dynamodb.DynamoDBRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DynamoDBService {

    private static final Long QUIZ_POLLING_SLEEP_TIME = 5000L;
    private static final Long DESCRIPTION_POLLING_SLEEP_TIME = 10000L;
    private static final Long POLLING_MAX_ATTEMPTS = 36L;
    private final DynamoDBRepository dynamoDBRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public String pollDescription(String quizDocId) {
        int attempts = 0;
        String description = dynamoDBRepository.getDescriptionFromDB(quizDocId);
        while (description.isEmpty() && attempts < POLLING_MAX_ATTEMPTS / 2) {
            sleep(DESCRIPTION_POLLING_SLEEP_TIME);
            attempts++;
            description = dynamoDBRepository.getDescriptionFromDB(quizDocId);
        }
        if (description.isEmpty()) {
            throw new GameException(FAILED_TO_FETCH_DESCRIPTION);
        }
        return description;
    }

    public List<QuizDTO> pollQuizzes(String quizDocId, Integer currentRound, Integer quizSize)
            throws GameException {
        int attempts = 0;
        List<Map<String, Object>> rawQuizzes = dynamoDBRepository.getQuizFromDB(quizDocId);
        while (rawQuizzes.size() < (currentRound + 1) * quizSize && attempts < POLLING_MAX_ATTEMPTS) {
            sleep(QUIZ_POLLING_SLEEP_TIME);
            attempts++;
            rawQuizzes = dynamoDBRepository.getQuizFromDB(quizDocId);
            log.info("polling...");
        }
        if (rawQuizzes.size() < (currentRound + 1) * quizSize) {
            throw new GameException(FAILED_TO_FETCH_QUIZ);
        }
        log.info("polling done.");
        return convertToQuizDTO(rawQuizzes);
    }

    public List<QuizDTO> getAllQuiz(String quizDocId) {
        List<Map<String, Object>> rawQuizzes = dynamoDBRepository.getQuizFromDB(quizDocId);
        return convertToQuizDTO(rawQuizzes);
    }

    public List<MarkDTO> getMark(String markDocId, String timestamp) {
        return convertToMarkDTO(dynamoDBRepository.getMarkFromDB(markDocId, timestamp));
    }

    private List<QuizDTO> convertToQuizDTO(List<Map<String, Object>> listMap) {
        List<QuizDTO> quizDTOList = new ArrayList<>();
        for (Map<String, Object> value : listMap) {
            QuizDTO quiz = mapper.convertValue(value, QuizDTO.class);
            quizDTOList.add(quiz);
        }
        return quizDTOList;
    }

    public List<MarkDTO> convertToMarkDTO(List<Map<String, Object>> listMap) {
        return listMap.stream()
                .map(map -> {
                    String id = (String) map.get("id");
                    String correct = (String) map.get("correct");
                    List<Map<String, Object>> markedsListMap = (List<Map<String, Object>>) map.get("markeds");
                    Integer quizNumber = ((BigDecimal) map.get("question_number")).intValue();

                    List<Marked> markeds = new ArrayList<>();
                    for (Map<String, Object> value : markedsListMap) {
                        Marked marked = mapper.convertValue(value, Marked.class);
                        markeds.add(marked);
                    }
                    return new MarkDTO(id, correct, markeds, quizNumber);
                })
                .toList();
    }
}
