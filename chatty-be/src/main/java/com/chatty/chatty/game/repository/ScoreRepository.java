package com.chatty.chatty.game.repository;

import com.chatty.chatty.game.domain.ScoreData;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ScoreRepository {
    private static final Map<Long, ScoreData> scoreDataMap = new ConcurrentHashMap<>();

    public ScoreData getScoreData(Long roomId) {
        return scoreDataMap.computeIfAbsent(roomId, this::initScoreData);
    }

    private ScoreData initScoreData(Long roomId) {
        return ScoreData.builder().build();
    }

    public void clearScoreData(Long roomId) {
        scoreDataMap.remove(roomId);
    }
}
