package com.friendsapp.service;

import com.friendsapp.dto.MatchDTO;
import com.friendsapp.entity.User;
import com.friendsapp.entity.UserMatch;
import com.friendsapp.exception.BadRequestException;
import com.friendsapp.exception.ResourceNotFoundException;
import com.friendsapp.mapper.MatchMapper;
import com.friendsapp.repository.UserMatchRepository;
import com.friendsapp.repository.UserRepository;
import com.friendsapp.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {
    
    private final UserMatchRepository matchRepository;
    private final UserRepository userRepository;
    private final MatchMapper matchMapper;
    private final EmailService emailService;
    private final ConversationService conversationService;
    
    @Transactional
    public MatchDTO createMatch(Long toUserId, UserMatch.MatchType matchType) {
        User currentUser = getCurrentUser();
        
        // Verificar que el usuario objetivo existe y está activo
        User toUser = userRepository.findById(toUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        if (!toUser.getIsActive()) {
            throw new BadRequestException("Usuario no disponible");
        }
        
        // No permitir match con uno mismo
        if (currentUser.getId().equals(toUserId)) {
            throw new BadRequestException("No puedes hacer match contigo mismo");
        }
        
        // Verificar si ya existe un match
        Optional<UserMatch> existingMatch = matchRepository.findByFromUserIdAndToUserId(
                currentUser.getId(), toUserId);
        
        if (existingMatch.isPresent()) {
            throw new BadRequestException("Ya has evaluado a este usuario");
        }
        
        // Crear el match
        UserMatch match = new UserMatch();
        match.setFromUser(currentUser);
        match.setToUser(toUser);
        match.setMatchType(matchType);
        match.setIsMutual(false);
        
        // Verificar si hay match mutuo (solo para LIKE y SUPER_LIKE)
        if (matchType == UserMatch.MatchType.LIKE || matchType == UserMatch.MatchType.SUPER_LIKE) {
            Optional<UserMatch> reciprocalMatch = matchRepository.findByFromUserIdAndToUserId(
                    toUserId, currentUser.getId());
            
            if (reciprocalMatch.isPresent() && 
                (reciprocalMatch.get().getMatchType() == UserMatch.MatchType.LIKE ||
                 reciprocalMatch.get().getMatchType() == UserMatch.MatchType.SUPER_LIKE)) {
                
                // Es un match mutuo
                match.setIsMutual(true);
                match.setMatchedAt(LocalDateTime.now());
                
                // Actualizar el match recíproco
                UserMatch reciprocal = reciprocalMatch.get();
                reciprocal.setIsMutual(true);
                reciprocal.setMatchedAt(LocalDateTime.now());
                matchRepository.save(reciprocal);
                
                // Crear conversación
                conversationService.createConversation(currentUser.getId(), toUserId);
                
                // Enviar notificaciones de email
                try {
                    emailService.sendNewMatchNotification(currentUser.getEmail(), toUser.getFirstName());
                    emailService.sendNewMatchNotification(toUser.getEmail(), currentUser.getFirstName());
                } catch (Exception e) {
                    log.error("Error enviando notificaciones de match: {}", e.getMessage());
                }
                
                log.info("Match mutuo creado entre usuarios {} y {}", currentUser.getId(), toUserId);
            }
        }
        
        UserMatch savedMatch = matchRepository.save(match);
        
        log.info("Match creado: usuario {} {} usuario {}", 
                currentUser.getId(), matchType, toUserId);
        
        return matchMapper.toDTO(savedMatch);
    }
    
    @Transactional(readOnly = true)
    public Page<MatchDTO> getMatches(Pageable pageable) {
        User currentUser = getCurrentUser();
        
        Page<UserMatch> matches = matchRepository.findByFromUserIdOrderByCreatedAtDesc(
                currentUser.getId(), pageable);
        
        return matches.map(matchMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<MatchDTO> getMutualMatches(Pageable pageable) {
        User currentUser = getCurrentUser();
        
        Page<UserMatch> mutualMatches = matchRepository.findMutualMatches(
                currentUser.getId(), pageable);
        
        return mutualMatches.map(matchMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public Page<MatchDTO> getPendingLikes(Pageable pageable) {
        User currentUser = getCurrentUser();
        
        Page<UserMatch> pendingLikes = matchRepository.findPendingLikes(
                currentUser.getId(), pageable);
        
        return pendingLikes.map(matchMapper::toDTO);
    }
    
    @Transactional(readOnly = true)
    public List<MatchDTO> getMatchesByType(UserMatch.MatchType matchType) {
        User currentUser = getCurrentUser();
        
        List<UserMatch> matches = matchRepository.findByFromUserIdAndMatchType(
                currentUser.getId(), matchType);
        
        return matches.stream()
                .map(matchMapper::toDTO)
                .toList();
    }
    
    @Transactional
    public void deleteMatch(Long matchId) {
        User currentUser = getCurrentUser();
        
        UserMatch match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match no encontrado"));
        
        // Verificar que el match pertenece al usuario actual
        if (!match.getFromUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("No tienes permiso para eliminar este match");
        }
        
        matchRepository.delete(match);
        
        log.info("Match eliminado: {}", matchId);
    }
    
    @Transactional(readOnly = true)
    public boolean haveMutualMatch(Long userId1, Long userId2) {
        return matchRepository.haveMutualMatch(userId1, userId2);
    }
    
    @Transactional(readOnly = true)
    public MatchStats getMatchStats() {
        User currentUser = getCurrentUser();
        
        long sentLikes = matchRepository.countByFromUserIdAndMatchType(
                currentUser.getId(), UserMatch.MatchType.LIKE);
        
        long sentSuperLikes = matchRepository.countByFromUserIdAndMatchType(
                currentUser.getId(), UserMatch.MatchType.SUPER_LIKE);
        
        long receivedLikes = matchRepository.countByToUserIdAndMatchType(
                currentUser.getId(), UserMatch.MatchType.LIKE);
        
        long receivedSuperLikes = matchRepository.countByToUserIdAndMatchType(
                currentUser.getId(), UserMatch.MatchType.SUPER_LIKE);
        
        List<UserMatch> mutualMatches = matchRepository.findMutualMatches(currentUser.getId());
        
        return new MatchStats(
                sentLikes,
                sentSuperLikes,
                receivedLikes,
                receivedSuperLikes,
                mutualMatches.size()
        );
    }
    
    @Transactional
    public void unmatch(Long userId) {
        User currentUser = getCurrentUser();
        
        // Verificar que tienen match mutuo
        if (!haveMutualMatch(currentUser.getId(), userId)) {
            throw new BadRequestException("No tienes match con este usuario");
        }
        
        // Eliminar ambos matches
        Optional<UserMatch> match1 = matchRepository.findByFromUserIdAndToUserId(
                currentUser.getId(), userId);
        Optional<UserMatch> match2 = matchRepository.findByFromUserIdAndToUserId(
                userId, currentUser.getId());
        
        match1.ifPresent(matchRepository::delete);
        match2.ifPresent(matchRepository::delete);
        
        // Desactivar conversación
        conversationService.deactivateConversation(currentUser.getId(), userId);
        
        log.info("Unmatch realizado entre usuarios {} y {}", currentUser.getId(), userId);
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
    
    // Clase para estadísticas de matches
    public record MatchStats(
            long sentLikes,
            long sentSuperLikes,
            long receivedLikes,
            long receivedSuperLikes,
            long mutualMatches
    ) {}
}