package com.friendsapp.mapper;

import com.friendsapp.dto.MessageDTO;
import com.friendsapp.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface MessageMapper {
    
    @Mapping(source = "conversation.id", target = "conversationId")
    @Mapping(source = "sender", target = "sender")
    MessageDTO toDTO(Message message);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "conversation", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "readAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Message toEntity(MessageDTO messageDTO);
}