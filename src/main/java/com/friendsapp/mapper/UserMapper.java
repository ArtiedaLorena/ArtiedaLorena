package com.friendsapp.mapper;

import com.friendsapp.dto.UserDTO;
import com.friendsapp.dto.UserPhotoDTO;
import com.friendsapp.entity.User;
import com.friendsapp.entity.UserPhoto;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    
    @Mapping(target = "age", expression = "java(user.getAge())")
    @Mapping(target = "distanceKm", ignore = true)
    UserDTO toDTO(User user);
    
    List<UserDTO> toDTOList(List<User> users);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastActiveAt", ignore = true)
    @Mapping(target = "photos", ignore = true)
    @Mapping(target = "sentMatches", ignore = true)
    @Mapping(target = "receivedMatches", ignore = true)
    @Mapping(target = "receivedReports", ignore = true)
    @Mapping(target = "sentReports", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "verificationToken", ignore = true)
    @Mapping(target = "verificationTokenExpiresAt", ignore = true)
    @Mapping(target = "resetPasswordToken", ignore = true)
    @Mapping(target = "resetPasswordTokenExpiresAt", ignore = true)
    User toEntity(UserDTO userDTO);
    
    UserPhotoDTO toDTO(UserPhoto userPhoto);
    
    List<UserPhotoDTO> toPhotoDTOList(List<UserPhoto> userPhotos);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    UserPhoto toEntity(UserPhotoDTO userPhotoDTO);
    
    @AfterMapping
    default void setDistanceFromContext(@MappingTarget UserDTO userDTO, User user, @Context Double distance) {
        if (distance != null) {
            userDTO.setDistanceKm(distance);
        }
    }
}