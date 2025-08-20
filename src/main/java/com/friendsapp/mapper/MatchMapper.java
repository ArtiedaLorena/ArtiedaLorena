package com.friendsapp.mapper;

import com.friendsapp.dto.MatchDTO;
import com.friendsapp.entity.UserMatch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface MatchMapper {
    
    @Mapping(source = "fromUser", target = "fromUser")
    @Mapping(source = "toUser", target = "toUser")
    MatchDTO toDTO(UserMatch userMatch);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "matchedAt", ignore = true)
    UserMatch toEntity(MatchDTO matchDTO);
}