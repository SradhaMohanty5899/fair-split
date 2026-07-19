package com.fairsplit.store;

import com.fairsplit.model.Group;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory store. Good enough for a portfolio project / testing target.
 * Swap for a JPA repository + real DB later if you want persistence — the
 * service layer is written so that swap wouldn't touch controllers at all.
 */
@Component
public class GroupStore {

    private final Map<String, Group> groups = new ConcurrentHashMap<>();

    public Group save(Group group) {
        groups.put(group.getId(), group);
        return group;
    }

    public Optional<Group> findById(String id) {
        return Optional.ofNullable(groups.get(id));
    }

    public boolean existsById(String id) {
        return groups.containsKey(id);
    }
}
