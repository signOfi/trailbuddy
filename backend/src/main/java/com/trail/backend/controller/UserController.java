package com.trail.backend.controller;

import com.trail.backend.dto.LoginDTO;
import com.trail.backend.dto.UserDTO;
import com.trail.backend.model.User;
import com.trail.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Collections;

@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userService.findByEmail(email);

        if (user != null) {
            UserDTO userDTO = convertToDto(user);
            return ResponseEntity.ok(userDTO);
        }
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping("/register")
    public ResponseEntity<User> registeredUser(@RequestBody UserDTO userDTO) {
        try {
            User registeredUser = convertToUser(userDTO);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDTO) {
        try {
            String token = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
            return ResponseEntity.ok().body(Collections.singletonMap("token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Bad username or password.");
        }
    }

    private User convertToUser(UserDTO userDTO) {
        /* User has the OPTION to upload profile picture so if nothing we give them a default profile picture */
        String profilePictureUrl = userDTO.getProfilePictureUrl() != null
                ? userDTO.getProfilePictureUrl() : "defaultProfilePicture.png";

        return userService.registerNewAccount(
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getEmail(),
                userDTO.getUsername(),
                userDTO.getPassword(),
                userDTO.getDateOfBirth(),
                userDTO.getState(),
                userDTO.getZipcode(),
                profilePictureUrl
        );
    }

    private UserDTO convertToDto(User user) {
        return new UserDTO(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getUsername(),
                user.getPassword(),
                user.getDateOfBirth(),
                user.getState(),
                user.getZipcode(),
                user.getProfilePictureUrl()
        );
    }

}
