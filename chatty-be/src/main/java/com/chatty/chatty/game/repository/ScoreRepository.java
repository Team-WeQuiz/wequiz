package com.chatty.chatty.game.repository;

import com.chatty.chatty.game.domain.ScoreData;
import com.chatty.chatty.player.domain.PlayersStatus;
import com.chatty.chatty.player.repository.PlayersStatusRepository;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ScoreRepository {

    private static final Map<Long, ScoreData> scoreDataMap = new ConcurrentHashMap<>();
    private final PlayersStatusRepository playersStatusRepository;

    public ScoreData getScoreData(Long roomId) {
        return scoreDataMap.computeIfAbsent(roomId, this::initScoreData);
    }

    private ScoreData initScoreData(Long roomId) {
        PlayersStatus playersStatus = playersStatusRepository.findByRoomId(roomId).get();
        return new ScoreData(playersStatus);
    }

    public void clearScoreData(Long roomId) {
        scoreDataMap.remove(roomId);
    }
}
