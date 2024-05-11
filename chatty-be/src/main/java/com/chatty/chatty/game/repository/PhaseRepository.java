package com.chatty.chatty.game.repository;

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
        return Phase.init();
    }

    public void clear(Long roomId) {
        phaseMap.remove(roomId);
    }

    public void update(Long roomId, Phase phase) {
        phaseMap.put(roomId, phase);
    }
}
