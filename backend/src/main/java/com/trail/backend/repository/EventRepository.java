package com.trail.backend.repository;

import com.trail.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDateAfter(LocalDateTime date);
    List<Event> findByHostId(Long hostId);
    List<Event> findByParticipantsId(Long participantId);
}
