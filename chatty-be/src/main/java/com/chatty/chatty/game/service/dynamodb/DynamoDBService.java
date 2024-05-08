package com.chatty.chatty.game.service.dynamodb;

import static com.chatty.chatty.common.util.ThreadSleep.sleep;
import static com.chatty.chatty.game.exception.GameExceptionType.FAILED_TO_FETCH_DESCRIPTION;

import com.chatty.chatty.game.controller.dto.dynamodb.MarkDTO;
import com.chatty.chatty.game.controller.dto.dynamodb.MarkDTO.Marked;
import com.chatty.chatty.game.controller.dto.dynamodb.QuizDTO;
import com.chatty.chatty.game.exception.GameException;
import com.chatty.chatty.game.repository.dynamodb.DynamoDBRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private static final Long POLLING_MAX_ATTEMPTS = 120L;
    private final DynamoDBRepository dynamoDBRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public String pollDescription(String itemId, String timestamp) {
        int attempts = 0;
        String description = dynamoDBRepository.getDescriptionFromDB(itemId, timestamp);
        while (description.isEmpty() && attempts < POLLING_MAX_ATTEMPTS) {
            sleep(DESCRIPTION_POLLING_SLEEP_TIME);
            attempts++;
            description = dynamoDBRepository.getDescriptionFromDB(itemId, timestamp);
        }
        if (description.isEmpty()) {
            throw new GameException(FAILED_TO_FETCH_DESCRIPTION);
        }
        return description;
    }

    public List<QuizDTO> pollQuizzes(String itemId, String timestamp, Integer currentRound, Integer quizSize) {
        List<Map<String, Object>> rawQuizzes = dynamoDBRepository.getQuizFromDB(itemId, timestamp);
        while (rawQuizzes.size() < (currentRound + 1) * quizSize) {
            sleep(QUIZ_POLLING_SLEEP_TIME);
            rawQuizzes = dynamoDBRepository.getQuizFromDB(itemId, timestamp);
            log.info("polling...");
        }
        log.info("polling done.");
        return convertToQuizDTO(rawQuizzes);
    }

    public List<QuizDTO> getAllQuiz(String itemId, String timestamp) {
        List<Map<String, Object>> rawQuizzes = dynamoDBRepository.getQuizFromDB(itemId, timestamp);
        return convertToQuizDTO(rawQuizzes);
    }

    public List<MarkDTO> getMark(String itemId) {
        return convertToMarkDTO(dynamoDBRepository.getMarkFromDB(itemId));
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
                    Integer quizNumber = (Integer) map.get("question_number");

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