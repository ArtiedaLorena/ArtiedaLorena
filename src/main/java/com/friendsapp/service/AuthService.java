package com.friendsapp.service;

import com.friendsapp.dto.*;
import com.friendsapp.entity.User;
import com.friendsapp.exception.BadRequestException;
import com.friendsapp.exception.ResourceNotFoundException;
import com.friendsapp.mapper.UserMapper;
import com.friendsapp.repository.UserRepository;
import com.friendsapp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final EmailService emailService;
    
    @Transactional
    public AuthResponseDTO register(UserRegistrationDTO registrationDTO) {
        log.info("Registrando nuevo usuario: {}", registrationDTO.getEmail());
        
        // Validar que el email no esté en uso
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }
        
        // Validar que el username no esté en uso
        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            throw new BadRequestException("El nombre de usuario ya está en uso");
        }
        
        // Validar edad mínima
        if (registrationDTO.getBirthDate().isAfter(LocalDate.now().minusYears(18))) {
            throw new BadRequestException("Debes ser mayor de 18 años para registrarte");
        }
        
        // Crear nuevo usuario
        User user = new User();
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setFirstName(registrationDTO.getFirstName());
        user.setLastName(registrationDTO.getLastName());
        user.setUsername(registrationDTO.getUsername());
        user.setBirthDate(registrationDTO.getBirthDate());
        user.setGender(registrationDTO.getGender());
        user.setBio(registrationDTO.getBio());
        user.setInterests(registrationDTO.getInterests());
        user.setIsActive(true);
        user.setIsVerified(false);
        user.setRole(User.Role.USER);
        
        // Generar token de verificación
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationTokenExpiresAt(LocalDateTime.now().plusHours(24));
        
        user = userRepository.save(user);
        
        // Enviar email de verificación
        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getVerificationToken());
        } catch (Exception e) {
            log.error("Error enviando email de verificación: {}", e.getMessage());
        }
        
        // Generar tokens
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                registrationDTO.getEmail(),
                registrationDTO.getPassword()
            )
        );
        
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        
        UserDTO userDTO = userMapper.toDTO(user);
        
        log.info("Usuario registrado exitosamente: {}", user.getEmail());
        
        return new AuthResponseDTO(accessToken, refreshToken, tokenProvider.getExpirationTime(), userDTO);
    }
    
    public AuthResponseDTO login(LoginDTO loginDTO) {
        log.info("Intento de login: {}", loginDTO.getEmailOrUsername());
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginDTO.getEmailOrUsername(),
                loginDTO.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        
        // Obtener usuario y actualizar última actividad
        User user = userRepository.findByEmailOrUsername(
            loginDTO.getEmailOrUsername(), 
            loginDTO.getEmailOrUsername()
        ).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.save(user);
        
        UserDTO userDTO = userMapper.toDTO(user);
        
        log.info("Login exitoso: {}", user.getEmail());
        
        return new AuthResponseDTO(accessToken, refreshToken, tokenProvider.getExpirationTime(), userDTO);
    }
    
    public AuthResponseDTO refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Token de refresh inválido");
        }
        
        String tokenType = tokenProvider.getTokenTypeFromToken(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new BadRequestException("Token de refresh inválido");
        }
        
        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmailOrUsername(username, username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        String newAccessToken = tokenProvider.generateAccessToken(username);
        String newRefreshToken = tokenProvider.generateRefreshToken(username);
        
        UserDTO userDTO = userMapper.toDTO(user);
        
        return new AuthResponseDTO(newAccessToken, newRefreshToken, tokenProvider.getExpirationTime(), userDTO);
    }
    
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
            .orElseThrow(() -> new BadRequestException("Token de verificación inválido"));
        
        if (user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token de verificación expirado");
        }
        
        user.setIsVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        
        userRepository.save(user);
        
        log.info("Email verificado exitosamente: {}", user.getEmail());
    }
    
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        if (user.getIsVerified()) {
            throw new BadRequestException("El email ya está verificado");
        }
        
        // Generar nuevo token
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationTokenExpiresAt(LocalDateTime.now().plusHours(24));
        
        userRepository.save(user);
        
        // Enviar email
        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationToken());
        
        log.info("Email de verificación reenviado: {}", email);
    }
    
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        // Generar token de reset
        user.setResetPasswordToken(UUID.randomUUID().toString());
        user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusHours(1));
        
        userRepository.save(user);
        
        // Enviar email de reset
        emailService.sendPasswordResetEmail(user.getEmail(), user.getResetPasswordToken());
        
        log.info("Email de reset de contraseña enviado: {}", email);
    }
    
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
            .orElseThrow(() -> new BadRequestException("Token de reset inválido"));
        
        if (user.getResetPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token de reset expirado");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        
        userRepository.save(user);
        
        log.info("Contraseña reseteada exitosamente: {}", user.getEmail());
    }
}