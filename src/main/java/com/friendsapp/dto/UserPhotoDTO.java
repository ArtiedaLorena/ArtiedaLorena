package com.friendsapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPhotoDTO {
    private Long id;
    private String photoUrl;
    private Integer displayOrder;
    private Boolean isPrimary;
    private LocalDateTime createdAt;
}