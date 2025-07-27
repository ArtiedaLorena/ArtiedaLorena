package com.friendsapp.mapper;

import com.friendsapp.dto.ConversationDTO;
import com.friendsapp.dto.UserDTO;
import com.friendsapp.entity.Conversation;
import com.friendsapp.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MessageMapper.class})
public interface ConversationMapper {
    
    @Mapping(target = "otherUser", ignore = true)
    @Mapping(target = "lastMessage", ignore = true)
    @Mapping(target = "unreadCount", ignore = true)
    ConversationDTO toDTO(Conversation conversation);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "messages", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Conversation toEntity(ConversationDTO conversationDTO);
    
    // Mapper específico para usuario en conversación (sin información sensible)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "currentLatitude", ignore = true)
    @Mapping(target = "currentLongitude", ignore = true)
    @Mapping(target = "distanceKm", ignore = true)
    @Mapping(target = "maxDistanceKm", ignore = true)
    @Mapping(target = "minAge", ignore = true)
    @Mapping(target = "maxAge", ignore = true)
    @Mapping(target = "showDistance", ignore = true)
    @Mapping(target = "showAge", ignore = true)
    UserDTO toUserDTO(User user);
}