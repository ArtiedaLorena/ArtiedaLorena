package com.friendsapp.dto;

import com.friendsapp.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private Long conversationId;
    private UserDTO sender;
    private String content;
    private Message.MessageType messageType;
    private Boolean isRead;
    private LocalDateTime readAt;
    private Boolean isDeleted;
    private String attachmentUrl;
    private String attachmentType;
    private String attachmentName;
    private LocalDateTime createdAt;
}