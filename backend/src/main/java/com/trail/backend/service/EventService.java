package com.trail.backend.service;

import com.trail.backend.dto.EventDTO;
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
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public EventDTO createEvent(EventDTO eventDTO, Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new UserNotFoundException("Host cannot be found"));
        Event event = convertToEntity(eventDTO);
        event.setHost(host);
        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    public List<EventDTO> getEventsByHost(Long hostId) {
        return eventRepository.findByHostId(hostId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByParticipant(Long participantId) {
        return eventRepository.findByParticipantsId(participantId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDate(event.getDate());
        dto.setLocation(event.getLocation());
        dto.setDescription(event.getDescription());
        dto.setDifficulty(event.getDifficulty());
        dto.setHostId(event.getHost().getId());
        dto.setHostName(event.getHost().getFirstName() + " " + event.getHost().getLastName());
        dto.setSpots(event.getSpots());
        dto.setEventImageUrl(event.getEventImageUrl());
        dto.setParticipantIds(event.getParticipants().stream()
                .map(User::getId)
                .collect(Collectors.toList()));
        return dto;
    }

    private Event convertToEntity(EventDTO dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDate(dto.getDate());
        event.setLocation(dto.getLocation());
        event.setDescription(dto.getDescription());
        event.setDifficulty(dto.getDifficulty());
        event.setSpots(dto.getSpots());
        event.setEventImageUrl(dto.getEventImageUrl());
        return event;
    }

    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event cannot be found"));
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDateTime.now());
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
            return eventRepository.save(event);
        } else {
            throw new IllegalStateException("User is already a participant");
        }
    }

    @Transactional
    public void leaveEvent(Long userId, Long eventId) {
        Event event = getEventById(eventId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (event.getHost().equals(user)) {
            throw new IllegalStateException("Host cannot leave the event. Use deleteEvent instead.");
        }

        if (event.getParticipants().remove(user)) {
            event.setSpots(event.getSpots() + 1);
            eventRepository.save(event);
        } else {
            throw new IllegalStateException("User is not a participant of this event");
        }
    }

    @Transactional
    public void deleteEvent(Long userId, Long eventId) {
        Event event = getEventById(eventId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!event.getHost().equals(user)) {
            throw new IllegalStateException("Only the host can delete the event.");
        }

        for (User participant : event.getParticipants()) {
            participant.getParticipatedEvents().remove(event);
            userRepository.save(participant);
        }

        user.getHostedEvents().remove(event);
        userRepository.save(user);

        eventRepository.delete(event);
    }
}