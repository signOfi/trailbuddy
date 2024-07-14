package com.trail.backend.controller;

import com.trail.backend.dto.EventDTO;
import com.trail.backend.exception.EventNotFoundException;
import com.trail.backend.exception.UserNotFoundException;
import com.trail.backend.model.Event;
import com.trail.backend.model.User;
import com.trail.backend.service.EventService;
import com.trail.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    @PostMapping("/events")
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Event event = convertToEntity(eventDTO);
            Long hostId = getUserIdFromUsername(userDetails.getUsername());
            Event createdEvent = eventService.createEvent(event, hostId);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(createdEvent));
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Long id) {
        try {
            Event event = eventService.getEventById(id);
            return ResponseEntity.ok(convertToDTO(event));
        } catch (EventNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        List<EventDTO> eventDTOs = events.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        List<Event> events = eventService.getUpcomingEvents();
        List<EventDTO> eventDTOs = events.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<EventDTO>> getEventsByParticipant(@PathVariable Long participantId) {
        List<Event> events = eventService.getEventsByParticipant(participantId);
        List<EventDTO> eventDTOs = events.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO) {
        try {
            Event event = convertToEntity(eventDTO);
            Event updatedEvent = eventService.updateEvent(id, event);
            return ResponseEntity.ok(convertToDTO(updatedEvent));
        } catch (EventNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getUserIdFromUsername(userDetails.getUsername());
            eventService.joinEvent(userId, id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EventNotFoundException | UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leaveEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getUserIdFromUsername(userDetails.getUsername());
            eventService.leaveEvent(userId, id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EventNotFoundException | UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long hostId = getUserIdFromUsername(userDetails.getUsername());
            eventService.cancelEvent(hostId, id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EventNotFoundException | UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private EventDTO convertToDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getLocation(),
                event.getDescription(),
                event.getDifficulty(),
                event.getHost(),
                event.getSpots(),
                event.getEventImageUrl(),
                event.getParticipants()
        );
    }

    private Event convertToEntity(EventDTO eventDTO) {
        return new Event(
                eventDTO.getId(),
                eventDTO.getTitle(),
                eventDTO.getDate(),
                eventDTO.getLocation(),
                eventDTO.getDescription(),
                eventDTO.getDifficulty(),
                eventDTO.getHost(),
                eventDTO.getSpots(),
                eventDTO.getEventImageUrl(),
                eventDTO.getParticipants()
        );
    }

    private Long getUserIdFromUsername(String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException("User not found with username: " + username);
        }
        return user.getId();
    }
}