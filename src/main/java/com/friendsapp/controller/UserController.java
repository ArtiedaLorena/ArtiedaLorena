package com.friendsapp.controller;

import com.friendsapp.dto.LocationUpdateDTO;
import com.friendsapp.dto.UserDTO;
import com.friendsapp.dto.UserPhotoDTO;
import com.friendsapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Users", description = "Gestión de usuarios y perfiles")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    @Operation(summary = "Obtener perfil del usuario actual")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Perfil obtenido exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        UserDTO profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/{userId}")
    @Operation(summary = "Obtener perfil de usuario por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Perfil obtenido exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<UserDTO> getUserById(
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/profile")
    @Operation(summary = "Actualizar perfil del usuario actual")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<UserDTO> updateProfile(@Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateProfile(userDTO);
        return ResponseEntity.ok(updatedUser);
    }
    
    @PutMapping("/location")
    @Operation(summary = "Actualizar ubicación del usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ubicación actualizada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Coordenadas inválidas"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> updateLocation(@Valid @RequestBody LocationUpdateDTO locationDTO) {
        userService.updateLocation(locationDTO);
        return ResponseEntity.ok(new MessageResponse("Ubicación actualizada exitosamente"));
    }
    
    @GetMapping("/nearby")
    @Operation(summary = "Obtener usuarios cercanos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios cercanos obtenidos exitosamente"),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<List<UserDTO>> getNearbyUsers(
            @Parameter(description = "Latitud") @RequestParam(required = false) Double latitude,
            @Parameter(description = "Longitud") @RequestParam(required = false) Double longitude,
            @Parameter(description = "Distancia máxima en km") @RequestParam(required = false) Double maxDistance,
            @Parameter(description = "Límite de resultados") @RequestParam(defaultValue = "50") Integer limit) {
        
        List<UserDTO> nearbyUsers = userService.getNearbyUsers(latitude, longitude, maxDistance, limit);
        return ResponseEntity.ok(nearbyUsers);
    }
    
    @GetMapping("/potential-matches")
    @Operation(summary = "Obtener usuarios potenciales para match")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios potenciales obtenidos exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<Page<UserDTO>> getPotentialMatches(
            @Parameter(description = "Edad mínima") @RequestParam(required = false) Integer minAge,
            @Parameter(description = "Edad máxima") @RequestParam(required = false) Integer maxAge,
            @Parameter(description = "Distancia máxima en km") @RequestParam(required = false) Integer maxDistance,
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> potentialMatches = userService.getPotentialMatches(minAge, maxAge, maxDistance, pageable);
        return ResponseEntity.ok(potentialMatches);
    }
    
    @GetMapping("/common-interests")
    @Operation(summary = "Obtener usuarios con intereses comunes")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios con intereses comunes obtenidos exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<List<UserDTO>> getUsersByCommonInterests(
            @Parameter(description = "Lista de intereses") @RequestParam(required = false) List<String> interests,
            @Parameter(description = "Límite de resultados") @RequestParam(defaultValue = "20") Integer limit) {
        
        List<UserDTO> users = userService.getUsersByCommonInterests(interests, limit);
        return ResponseEntity.ok(users);
    }
    
    @PostMapping(value = "/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Subir foto de perfil")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Foto subida exitosamente"),
        @ApiResponse(responseCode = "400", description = "Archivo inválido"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<UserPhotoDTO> uploadPhoto(
            @Parameter(description = "Archivo de imagen") @RequestParam("file") MultipartFile file) {
        UserPhotoDTO photo = userService.uploadPhoto(file);
        return ResponseEntity.ok(photo);
    }
    
    @DeleteMapping("/photos/{photoId}")
    @Operation(summary = "Eliminar foto de perfil")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Foto eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Foto no encontrada"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> deletePhoto(
            @Parameter(description = "ID de la foto") @PathVariable Long photoId) {
        userService.deletePhoto(photoId);
        return ResponseEntity.ok(new MessageResponse("Foto eliminada exitosamente"));
    }
    
    @PutMapping("/change-password")
    @Operation(summary = "Cambiar contraseña")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña cambiada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Contraseña actual incorrecta"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request.currentPassword(), request.newPassword());
        return ResponseEntity.ok(new MessageResponse("Contraseña cambiada exitosamente"));
    }
    
    @DeleteMapping("/deactivate")
    @Operation(summary = "Desactivar cuenta")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cuenta desactivada exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> deactivateAccount() {
        userService.deactivateAccount();
        return ResponseEntity.ok(new MessageResponse("Cuenta desactivada exitosamente"));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Buscar usuarios")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<List<UserDTO>> searchUsers(
            @Parameter(description = "Término de búsqueda") @RequestParam String query,
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<UserDTO> users = userService.searchUsers(query, pageable);
        return ResponseEntity.ok(users);
    }
    
    // DTOs para requests
    public record MessageResponse(String message) {}
    
    public record ChangePasswordRequest(
            @Parameter(description = "Contraseña actual") String currentPassword,
            @Parameter(description = "Nueva contraseña") String newPassword
    ) {}
}