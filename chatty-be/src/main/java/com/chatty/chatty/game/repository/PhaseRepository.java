package com.chatty.chatty.game.repository;

import static com.chatty.chatty.game.domain.Phase.QUIZ_SOLVING;

import com.chatty.chatty.game.domain.Phase;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class PhaseRepository {

    private static final Map<Long, Phase> phaseMap = new ConcurrentHashMap<>();

    public Phase getPhase(Long roomId) {
        return phaseMap.computeIfAbsent(roomId, this::init);
    }

    public Phase init(Long roomId) {
        phaseMap.put(roomId, Phase.init());
        return QUIZ_SOLVING;
    }

    public void clear(Long roomId) {
        phaseMap.remove(roomId);
    }

    public void update(Long roomId, Phase phase) {
        phaseMap.put(roomId, phase);
    }
}
