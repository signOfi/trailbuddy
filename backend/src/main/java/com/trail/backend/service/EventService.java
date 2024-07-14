package com.trail.backend.service;

import com.trail.backend.exception.EventNotFoundException;
import com.trail.backend.exception.UserNotFoundException;
import com.trail.backend.model.Event;
import com.trail.backend.model.User;
import com.trail.backend.repository.EventRepository;
import com.trail.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Event createEvent(Event event, Long hostId) {
        /* Host is needed and no participants are needed, so we just make a 1:1 mapping */
        User host = userRepository.findById(hostId)
                .orElseThrow( () -> new UserNotFoundException("Host cannot be found"));
        event.setHost(host);
        return eventRepository.save(event);
    }

    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow( () -> new EventNotFoundException("Event cannot be found"));
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDateTime.now());
    }

    public List<Event> getEventsByParticipant(Long participantId) {
        return eventRepository.findByParticipantsId(participantId);
    }

    @Transactional
    public Event updateEvent(Long eventId, Event updatedEvent) {
        Event event = getEventById(eventId);
        event.setTitle(updatedEvent.getTitle());
        event.setDate(updatedEvent.getDate());
        event.setLocation(updatedEvent.getLocation());
        event.setDescription(updatedEvent.getDescription());
        event.setDifficulty(updatedEvent.getDifficulty());
        event.setSpots(updatedEvent.getSpots());
        event.setEventImageUrl(updatedEvent.getEventImageUrl());
        return eventRepository.save(event);
    }

    @Transactional
    public Event joinEvent(Long userId, Long eventId) {
        Event event = getEventById(eventId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (event.getSpots() <= 0) {
            throw new IllegalStateException("No available spots for this event");
        }

        if (!event.getParticipants().contains(user)) {
            event.getParticipants().add(user);
            event.setSpots(event.getSpots() - 1);
            return eventRepository.save(event);  // Return the saved event
        } else {
            throw new IllegalStateException("User is already a participant");
        }
    }

    @Transactional
    public void leaveEvent(Long userId, Long eventId) {
        Event event = getEventById(eventId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EventNotFoundException("User not found"));

        if (event.getHost().equals(user)) {
            throw new IllegalStateException("Host cannot leave the event. Use cancelEvent instead.");
        }

        if (event.getParticipants().remove(user)) {
            event.setSpots(event.getSpots() + 1);
            eventRepository.save(event);
        } else {
            throw new IllegalStateException("User is not a participant of this event");
        }
    }

    @Transactional
    public void cancelEvent(Long hostId, Long eventId) {
        Event event = getEventById(eventId);
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new EventNotFoundException("User not found"));

        if (!event.getHost().equals(host)) {
            throw new IllegalStateException("Only the host can cancel the event.");
        }
        eventRepository.delete(event);
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

}
