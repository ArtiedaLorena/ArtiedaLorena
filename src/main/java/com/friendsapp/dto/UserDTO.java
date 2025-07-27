package com.friendsapp.dto;

import com.friendsapp.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private LocalDate birthDate;
    private Integer age;
    private User.Gender gender;
    private String bio;
    private String profilePictureUrl;
    private Double currentLatitude;
    private Double currentLongitude;
    private Double distanceKm; // Calculada dinámicamente
    private Boolean isActive;
    private Boolean isVerified;
    private Boolean showDistance;
    private Boolean showAge;
    private Integer maxDistanceKm;
    private Integer minAge;
    private Integer maxAge;
    private List<String> interests;
    private List<UserPhotoDTO> photos;
    private LocalDateTime lastActiveAt;
    private LocalDateTime createdAt;
}