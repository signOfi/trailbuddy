package com.trail.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String dateOfBirth;
    private String state;
    private String zipcode;
    private String profilePictureUrl;
    private List<Long> hostedEventIds;
    private List<Long> participatedEventIds;
}