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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long hostId = getUserIdFromUsername(userDetails.getUsername());
            EventDTO createdEvent = eventService.createEvent(eventDTO, hostId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/hosted")
    public ResponseEntity<List<EventDTO>> getUserHostedEvents(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<EventDTO> events = eventService.getEventsByHost(user.getId());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/participated")
    public ResponseEntity<List<EventDTO>> getUserParticipatedEvents(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<EventDTO> events = eventService.getEventsByParticipant(user.getId());
        return ResponseEntity.ok(events);
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

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getUserIdFromUsername(userDetails.getUsername());
            Event updatedEvent = eventService.joinEvent(userId, id);
            return ResponseEntity.ok(convertToDTO(updatedEvent));
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
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getUserIdFromUsername(userDetails.getUsername());
            eventService.deleteEvent(userId, id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EventNotFoundException | UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
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

    private Long getUserIdFromUsername(String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException("User not found with username: " + username);
        }
        return user.getId();
    }
}