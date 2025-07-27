package com.friendsapp.service;

import com.friendsapp.dto.LocationUpdateDTO;
import com.friendsapp.dto.UserDTO;
import com.friendsapp.dto.UserPhotoDTO;
import com.friendsapp.entity.User;
import com.friendsapp.entity.UserPhoto;
import com.friendsapp.exception.BadRequestException;
import com.friendsapp.exception.ResourceNotFoundException;
import com.friendsapp.mapper.UserMapper;
import com.friendsapp.repository.UserRepository;
import com.friendsapp.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;
    
    @Transactional(readOnly = true)
    public UserDTO getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        return userMapper.toDTO(currentUser);
    }
    
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        if (!user.getIsActive()) {
            throw new ResourceNotFoundException("Usuario no disponible");
        }
        
        return userMapper.toDTO(user);
    }
    
    @Transactional
    public UserDTO updateProfile(UserDTO userDTO) {
        User currentUser = getCurrentUser();
        
        // Actualizar campos permitidos
        if (userDTO.getFirstName() != null) {
            currentUser.setFirstName(userDTO.getFirstName());
        }
        if (userDTO.getLastName() != null) {
            currentUser.setLastName(userDTO.getLastName());
        }
        if (userDTO.getBio() != null) {
            currentUser.setBio(userDTO.getBio());
        }
        if (userDTO.getInterests() != null) {
            currentUser.setInterests(userDTO.getInterests());
        }
        if (userDTO.getMaxDistanceKm() != null) {
            currentUser.setMaxDistanceKm(userDTO.getMaxDistanceKm());
        }
        if (userDTO.getMinAge() != null) {
            currentUser.setMinAge(userDTO.getMinAge());
        }
        if (userDTO.getMaxAge() != null) {
            currentUser.setMaxAge(userDTO.getMaxAge());
        }
        if (userDTO.getShowDistance() != null) {
            currentUser.setShowDistance(userDTO.getShowDistance());
        }
        if (userDTO.getShowAge() != null) {
            currentUser.setShowAge(userDTO.getShowAge());
        }
        
        User updatedUser = userRepository.save(currentUser);
        log.info("Perfil actualizado para usuario: {}", currentUser.getEmail());
        
        return userMapper.toDTO(updatedUser);
    }
    
    @Transactional
    public void updateLocation(LocationUpdateDTO locationDTO) {
        User currentUser = getCurrentUser();
        
        currentUser.setCurrentLatitude(locationDTO.getLatitude());
        currentUser.setCurrentLongitude(locationDTO.getLongitude());
        currentUser.setLocationUpdatedAt(LocalDateTime.now());
        
        userRepository.save(currentUser);
        log.info("Ubicación actualizada para usuario: {}", currentUser.getEmail());
    }
    
    @Transactional(readOnly = true)
    public List<UserDTO> getNearbyUsers(Double latitude, Double longitude, Double maxDistanceKm, Integer limit) {
        User currentUser = getCurrentUser();
        
        if (latitude == null || longitude == null) {
            // Usar ubicación del usuario actual si no se proporciona
            latitude = currentUser.getCurrentLatitude();
            longitude = currentUser.getCurrentLongitude();
        }
        
        if (latitude == null || longitude == null) {
            throw new BadRequestException("Ubicación requerida para buscar usuarios cercanos");
        }
        
        if (maxDistanceKm == null) {
            maxDistanceKm = currentUser.getMaxDistanceKm().doubleValue();
        }
        
        List<Object[]> nearbyUsersData = userRepository.findUsersNearby(
                latitude, longitude, maxDistanceKm, currentUser.getId()
        );
        
        return nearbyUsersData.stream()
                .limit(limit != null ? limit : 50)
                .map(data -> {
                    User user = (User) data[0];
                    Double distance = (Double) data[1];
                    UserDTO userDTO = userMapper.toDTO(user);
                    userDTO.setDistanceKm(distance);
                    return userDTO;
                })
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<UserDTO> getPotentialMatches(Integer minAge, Integer maxAge, Integer maxDistance, 
                                           Pageable pageable) {
        User currentUser = getCurrentUser();
        
        // Usar preferencias del usuario si no se especifican
        if (minAge == null) minAge = currentUser.getMinAge();
        if (maxAge == null) maxAge = currentUser.getMaxAge();
        if (maxDistance == null) maxDistance = currentUser.getMaxDistanceKm();
        
        Page<User> potentialMatches = userRepository.findPotentialMatches(currentUser.getId(), pageable);
        
        return potentialMatches.map(user -> {
            UserDTO userDTO = userMapper.toDTO(user);
            
            // Calcular distancia si ambos usuarios tienen ubicación
            if (currentUser.hasLocation() && user.hasLocation()) {
                double distance = calculateDistance(
                        currentUser.getCurrentLatitude(), currentUser.getCurrentLongitude(),
                        user.getCurrentLatitude(), user.getCurrentLongitude()
                );
                userDTO.setDistanceKm(distance);
            }
            
            return userDTO;
        });
    }
    
    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByCommonInterests(List<String> interests, Integer limit) {
        User currentUser = getCurrentUser();
        
        if (interests == null || interests.isEmpty()) {
            interests = currentUser.getInterests();
        }
        
        if (interests == null || interests.isEmpty()) {
            return List.of();
        }
        
        List<User> users = userRepository.findUsersByCommonInterests(currentUser.getId(), interests);
        
        return users.stream()
                .limit(limit != null ? limit : 20)
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public UserPhotoDTO uploadPhoto(MultipartFile file) {
        User currentUser = getCurrentUser();
        
        // Validar archivo
        if (file.isEmpty()) {
            throw new BadRequestException("Archivo de imagen requerido");
        }
        
        if (!isImageFile(file)) {
            throw new BadRequestException("Solo se permiten archivos de imagen");
        }
        
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new BadRequestException("El archivo es demasiado grande (máximo 10MB)");
        }
        
        // Verificar límite de fotos
        if (currentUser.getPhotos().size() >= 6) {
            throw new BadRequestException("Máximo 6 fotos permitidas");
        }
        
        try {
            // Subir a Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);
            
            // Crear nueva foto
            UserPhoto photo = new UserPhoto();
            photo.setUser(currentUser);
            photo.setPhotoUrl(imageUrl);
            photo.setDisplayOrder(currentUser.getPhotos().size());
            photo.setIsPrimary(currentUser.getPhotos().isEmpty()); // Primera foto es principal
            
            currentUser.getPhotos().add(photo);
            
            // Si es la primera foto, establecer como foto de perfil
            if (currentUser.getProfilePictureUrl() == null) {
                currentUser.setProfilePictureUrl(imageUrl);
            }
            
            userRepository.save(currentUser);
            
            log.info("Foto subida exitosamente para usuario: {}", currentUser.getEmail());
            
            return userMapper.toDTO(photo);
            
        } catch (Exception e) {
            log.error("Error subiendo foto para usuario {}: {}", currentUser.getEmail(), e.getMessage());
            throw new BadRequestException("Error al subir la imagen");
        }
    }
    
    @Transactional
    public void deletePhoto(Long photoId) {
        User currentUser = getCurrentUser();
        
        UserPhoto photo = currentUser.getPhotos().stream()
                .filter(p -> p.getId().equals(photoId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Foto no encontrada"));
        
        try {
            // Eliminar de Cloudinary
            cloudinaryService.deleteImage(photo.getPhotoUrl());
            
            // Eliminar de la base de datos
            currentUser.getPhotos().remove(photo);
            
            // Si era la foto de perfil, establecer otra como principal
            if (photo.getIsPrimary() && !currentUser.getPhotos().isEmpty()) {
                UserPhoto newPrimary = currentUser.getPhotos().get(0);
                newPrimary.setIsPrimary(true);
                currentUser.setProfilePictureUrl(newPrimary.getPhotoUrl());
            } else if (photo.getIsPrimary()) {
                currentUser.setProfilePictureUrl(null);
            }
            
            userRepository.save(currentUser);
            
            log.info("Foto eliminada exitosamente para usuario: {}", currentUser.getEmail());
            
        } catch (Exception e) {
            log.error("Error eliminando foto para usuario {}: {}", currentUser.getEmail(), e.getMessage());
            throw new BadRequestException("Error al eliminar la imagen");
        }
    }
    
    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        User currentUser = getCurrentUser();
        
        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
            throw new BadRequestException("Contraseña actual incorrecta");
        }
        
        // Validar nueva contraseña
        if (newPassword.length() < 8) {
            throw new BadRequestException("La nueva contraseña debe tener al menos 8 caracteres");
        }
        
        currentUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);
        
        log.info("Contraseña cambiada exitosamente para usuario: {}", currentUser.getEmail());
    }
    
    @Transactional
    public void deactivateAccount() {
        User currentUser = getCurrentUser();
        currentUser.setIsActive(false);
        userRepository.save(currentUser);
        
        log.info("Cuenta desactivada para usuario: {}", currentUser.getEmail());
    }
    
    @Transactional(readOnly = true)
    public List<UserDTO> searchUsers(String query, Pageable pageable) {
        // Implementar búsqueda por nombre o username
        // Por ahora retornamos lista vacía
        return List.of();
    }
    
    // Métodos de utilidad
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Usuario no autenticado");
        }
        
        CustomUserDetailsService.UserPrincipal userPrincipal = 
                (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();
        
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
    
    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }
    
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radio de la Tierra en km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
}