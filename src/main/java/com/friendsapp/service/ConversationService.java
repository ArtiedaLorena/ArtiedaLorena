package com.friendsapp.service;

import com.friendsapp.dto.ConversationDTO;
import com.friendsapp.dto.MessageDTO;
import com.friendsapp.entity.Conversation;
import com.friendsapp.entity.Message;
import com.friendsapp.entity.User;
import com.friendsapp.exception.BadRequestException;
import com.friendsapp.exception.ResourceNotFoundException;
import com.friendsapp.mapper.ConversationMapper;
import com.friendsapp.mapper.MessageMapper;
import com.friendsapp.repository.ConversationRepository;
import com.friendsapp.repository.MessageRepository;
import com.friendsapp.repository.UserRepository;
import com.friendsapp.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConversationService {
    
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationMapper conversationMapper;
    private final MessageMapper messageMapper;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional(readOnly = true)
    public Page<ConversationDTO> getUserConversations(Pageable pageable) {
        User currentUser = getCurrentUser();
        
        Page<Conversation> conversations = conversationRepository.findUserConversations(
                currentUser.getId(), pageable);
        
        return conversations.map(conversation -> {
            ConversationDTO dto = conversationMapper.toDTO(conversation);
            
            // Obtener el otro usuario
            User otherUser = conversation.getOtherUser(currentUser.getId());
            dto.setOtherUser(conversationMapper.toUserDTO(otherUser));
            
            // Obtener último mensaje
            Message lastMessage = messageRepository.findLastMessage(conversation.getId());
            if (lastMessage != null) {
                dto.setLastMessage(messageMapper.toDTO(lastMessage));
            }
            
            // Contar mensajes no leídos
            long unreadCount = messageRepository.countUnreadMessages(
                    conversation.getId(), currentUser.getId());
            dto.setUnreadCount((int) unreadCount);
            
            return dto;
        });
    }
    
    @Transactional(readOnly = true)
    public ConversationDTO getConversation(Long conversationId) {
        User currentUser = getCurrentUser();
        
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
        
        // Verificar que el usuario es parte de la conversación
        if (!conversation.containsUser(currentUser.getId())) {
            throw new BadRequestException("No tienes acceso a esta conversación");
        }
        
        ConversationDTO dto = conversationMapper.toDTO(conversation);
        
        // Obtener el otro usuario
        User otherUser = conversation.getOtherUser(currentUser.getId());
        dto.setOtherUser(conversationMapper.toUserDTO(otherUser));
        
        return dto;
    }
    
    @Transactional
    public ConversationDTO createConversation(Long userId1, Long userId2) {
        // Verificar que los usuarios existen
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        // Verificar si ya existe una conversación
        Optional<Conversation> existingConversation = conversationRepository.findByUsers(userId1, userId2);
        if (existingConversation.isPresent()) {
            return conversationMapper.toDTO(existingConversation.get());
        }
        
        // Crear nueva conversación
        Conversation conversation = new Conversation();
        conversation.setUser1(user1);
        conversation.setUser2(user2);
        conversation.setIsActive(true);
        
        Conversation savedConversation = conversationRepository.save(conversation);
        
        log.info("Conversación creada entre usuarios {} y {}", userId1, userId2);
        
        return conversationMapper.toDTO(savedConversation);
    }
    
    @Transactional(readOnly = true)
    public Page<MessageDTO> getMessages(Long conversationId, Pageable pageable) {
        User currentUser = getCurrentUser();
        
        // Verificar acceso a la conversación
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
        
        if (!conversation.containsUser(currentUser.getId())) {
            throw new BadRequestException("No tienes acceso a esta conversación");
        }
        
        Page<Message> messages = messageRepository.findByConversationIdAndIsDeletedFalseOrderByCreatedAtDesc(
                conversationId, pageable);
        
        return messages.map(messageMapper::toDTO);
    }
    
    @Transactional
    public MessageDTO sendMessage(Long conversationId, String content, Message.MessageType messageType) {
        User currentUser = getCurrentUser();
        
        // Verificar acceso a la conversación
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
        
        if (!conversation.containsUser(currentUser.getId())) {
            throw new BadRequestException("No tienes acceso a esta conversación");
        }
        
        if (!conversation.getIsActive()) {
            throw new BadRequestException("Esta conversación no está activa");
        }
        
        // Crear mensaje
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setContent(content);
        message.setMessageType(messageType != null ? messageType : Message.MessageType.TEXT);
        message.setIsRead(false);
        message.setIsDeleted(false);
        
        Message savedMessage = messageRepository.save(message);
        
        // Actualizar última actividad de la conversación
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);
        
        // Enviar mensaje por WebSocket
        MessageDTO messageDTO = messageMapper.toDTO(savedMessage);
        
        // Enviar a ambos usuarios
        messagingTemplate.convertAndSend(
                "/topic/conversation/" + conversationId, 
                messageDTO
        );
        
        log.info("Mensaje enviado en conversación {} por usuario {}", 
                conversationId, currentUser.getId());
        
        return messageDTO;
    }
    
    @Transactional
    public void markMessagesAsRead(Long conversationId) {
        User currentUser = getCurrentUser();
        
        // Verificar acceso a la conversación
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversación no encontrada"));
        
        if (!conversation.containsUser(currentUser.getId())) {
            throw new BadRequestException("No tienes acceso a esta conversación");
        }
        
        // Marcar mensajes como leídos
        messageRepository.markMessagesAsRead(conversationId, currentUser.getId(), LocalDateTime.now());
        
        log.info("Mensajes marcados como leídos en conversación {} por usuario {}", 
                conversationId, currentUser.getId());
    }
    
    @Transactional
    public void deleteMessage(Long messageId) {
        User currentUser = getCurrentUser();
        
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Mensaje no encontrado"));
        
        // Verificar que el mensaje pertenece al usuario actual
        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new BadRequestException("No puedes eliminar este mensaje");
        }
        
        message.markAsDeleted();
        messageRepository.save(message);
        
        // Notificar por WebSocket
        messagingTemplate.convertAndSend(
                "/topic/conversation/" + message.getConversation().getId() + "/delete", 
                messageId
        );
        
        log.info("Mensaje {} eliminado por usuario {}", messageId, currentUser.getId());
    }
    
    @Transactional
    public void deactivateConversation(Long userId1, Long userId2) {
        Optional<Conversation> conversation = conversationRepository.findByUsers(userId1, userId2);
        
        if (conversation.isPresent()) {
            Conversation conv = conversation.get();
            conv.setIsActive(false);
            conversationRepository.save(conv);
            
            log.info("Conversación desactivada entre usuarios {} y {}", userId1, userId2);
        }
    }
    
    @Transactional(readOnly = true)
    public long getUnreadMessagesCount() {
        User currentUser = getCurrentUser();
        return messageRepository.countAllUnreadMessages(currentUser.getId());
    }
    
    @Transactional(readOnly = true)
    public boolean hasActiveConversation(Long userId1, Long userId2) {
        return conversationRepository.existsActiveConversationBetweenUsers(userId1, userId2);
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
}