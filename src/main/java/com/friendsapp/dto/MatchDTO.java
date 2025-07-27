package com.friendsapp.dto;

import com.friendsapp.entity.UserMatch;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDTO {
    private Long id;
    private UserDTO fromUser;
    private UserDTO toUser;
    private UserMatch.MatchType matchType;
    private Boolean isMutual;
    private LocalDateTime createdAt;
    private LocalDateTime matchedAt;
}