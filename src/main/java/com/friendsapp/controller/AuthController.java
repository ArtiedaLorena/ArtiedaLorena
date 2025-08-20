package com.friendsapp.controller;

import com.friendsapp.dto.*;
import com.friendsapp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Autenticación", description = "Endpoints para registro, login y gestión de tokens")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "Registrar nuevo usuario", description = "Crea una nueva cuenta de usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de registro inválidos"),
        @ApiResponse(responseCode = "409", description = "Email o username ya existe")
    })
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        log.info("Solicitud de registro para email: {}", registrationDTO.getEmail());
        
        AuthResponseDTO response = authService.register(registrationDTO);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve tokens JWT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login exitoso"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas"),
        @ApiResponse(responseCode = "400", description = "Datos de login inválidos")
    })
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("Solicitud de login para: {}", loginDTO.getEmailOrUsername());
        
        AuthResponseDTO response = authService.login(loginDTO);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Renovar token de acceso", description = "Genera un nuevo token de acceso usando el refresh token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token renovado exitosamente"),
        @ApiResponse(responseCode = "401", description = "Refresh token inválido o expirado")
    })
    public ResponseEntity<AuthResponseDTO> refreshToken(@RequestBody RefreshTokenDTO refreshTokenDTO) {
        log.info("Solicitud de refresh token");
        
        AuthResponseDTO response = authService.refreshToken(refreshTokenDTO.getRefreshToken());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify-email")
    @Operation(summary = "Verificar email", description = "Verifica la dirección de email del usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email verificado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Token de verificación inválido o expirado")
    })
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        log.info("Solicitud de verificación de email con token: {}", token);
        
        authService.verifyEmail(token);
        
        return ResponseEntity.ok(new MessageResponse("Email verificado exitosamente"));
    }
    
    @PostMapping("/resend-verification")
    @Operation(summary = "Reenviar email de verificación", description = "Envía un nuevo email de verificación")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email de verificación enviado"),
        @ApiResponse(responseCode = "400", description = "Email ya verificado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<MessageResponse> resendVerificationEmail(@RequestBody EmailRequestDTO emailRequest) {
        log.info("Solicitud de reenvío de verificación para: {}", emailRequest.getEmail());
        
        authService.resendVerificationEmail(emailRequest.getEmail());
        
        return ResponseEntity.ok(new MessageResponse("Email de verificación enviado"));
    }
    
    @PostMapping("/forgot-password")
    @Operation(summary = "Solicitar reset de contraseña", description = "Envía un email para restablecer la contraseña")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email de reset enviado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<MessageResponse> forgotPassword(@RequestBody EmailRequestDTO emailRequest) {
        log.info("Solicitud de reset de contraseña para: {}", emailRequest.getEmail());
        
        authService.forgotPassword(emailRequest.getEmail());
        
        return ResponseEntity.ok(new MessageResponse("Si el email existe, se ha enviado un enlace de reset"));
    }
    
    @PostMapping("/reset-password")
    @Operation(summary = "Restablecer contraseña", description = "Restablece la contraseña usando el token de reset")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contraseña restablecida exitosamente"),
        @ApiResponse(responseCode = "400", description = "Token de reset inválido o expirado")
    })
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        log.info("Solicitud de reset de contraseña con token");
        
        authService.resetPassword(resetPasswordDTO.getToken(), resetPasswordDTO.getNewPassword());
        
        return ResponseEntity.ok(new MessageResponse("Contraseña restablecida exitosamente"));
    }
    
    // DTOs adicionales para los endpoints
    public record RefreshTokenDTO(String refreshToken) {}
    
    public record EmailRequestDTO(String email) {}
    
    public record ResetPasswordDTO(String token, String newPassword) {}
    
    public record MessageResponse(String message) {}
}