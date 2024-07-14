package com.trail.backend.service;

import com.trail.backend.model.User;
import com.trail.backend.model.Event;
import com.trail.backend.repository.UserRepository;
import com.trail.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerNewAccount(String firstName, String lastName, String email, String username, String password, String dateOfBirth, String state, String zipcode, String profilePictureUrl) {
        if (userRepository.findByUsername(username) != null)
            throw new RuntimeException("Username already exists");

        if (userRepository.findByEmail(email) != null)
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setDateOfBirth(dateOfBirth);
        user.setState(state);
        user.setZipcode(zipcode);
        user.setProfilePictureUrl(profilePictureUrl);
        return userRepository.save(user);
    }

    public String login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtTokenProvider.generateToken(userDetails);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<Event> getUserHostedEvents(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getHostedEvents();
    }

    public List<Event> getUserParticipatedEvents(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getParticipatedEvents();
    }

    public void addHostedEvent(Long userId, Event event) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getHostedEvents().add(event);
        userRepository.save(user);
    }

    public void addParticipatedEvent(Long userId, Event event) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getParticipatedEvents().add(event);
        userRepository.save(user);
    }

    public void removeHostedEvent(Long userId, Event event) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getHostedEvents().remove(event);
        userRepository.save(user);
    }

    public void removeParticipatedEvent(Long userId, Event event) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getParticipatedEvents().remove(event);
        userRepository.save(user);
    }

}