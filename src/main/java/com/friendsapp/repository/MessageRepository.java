package com.friendsapp.repository;

import com.friendsapp.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Obtener mensajes de una conversación ordenados por fecha
    Page<Message> findByConversationIdAndIsDeletedFalseOrderByCreatedAtDesc(Long conversationId, Pageable pageable);
    
    // Obtener mensajes no leídos de una conversación para un usuario específico
    @Query("""
        SELECT m FROM Message m 
        WHERE m.conversation.id = :conversationId 
          AND m.sender.id != :userId 
          AND m.isRead = false 
          AND m.isDeleted = false
        ORDER BY m.createdAt ASC
        """)
    List<Message> findUnreadMessages(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
    
    // Contar mensajes no leídos de una conversación para un usuario específico
    @Query("""
        SELECT COUNT(m) FROM Message m 
        WHERE m.conversation.id = :conversationId 
          AND m.sender.id != :userId 
          AND m.isRead = false 
          AND m.isDeleted = false
        """)
    long countUnreadMessages(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
    
    // Contar todos los mensajes no leídos de un usuario
    @Query("""
        SELECT COUNT(m) FROM Message m 
        JOIN m.conversation c
        WHERE (c.user1.id = :userId OR c.user2.id = :userId)
          AND m.sender.id != :userId 
          AND m.isRead = false 
          AND m.isDeleted = false
        """)
    long countAllUnreadMessages(@Param("userId") Long userId);
    
    // Obtener el último mensaje de una conversación
    @Query("""
        SELECT m FROM Message m 
        WHERE m.conversation.id = :conversationId 
          AND m.isDeleted = false
        ORDER BY m.createdAt DESC 
        LIMIT 1
        """)
    Message findLastMessage(@Param("conversationId") Long conversationId);
    
    // Marcar todos los mensajes de una conversación como leídos para un usuario
    @Modifying
    @Query("""
        UPDATE Message m 
        SET m.isRead = true, m.readAt = :readAt
        WHERE m.conversation.id = :conversationId 
          AND m.sender.id != :userId 
          AND m.isRead = false
        """)
    void markMessagesAsRead(@Param("conversationId") Long conversationId, 
                           @Param("userId") Long userId, 
                           @Param("readAt") LocalDateTime readAt);
    
    // Obtener mensajes por tipo
    List<Message> findByConversationIdAndMessageType(Long conversationId, Message.MessageType messageType);
    
    // Buscar mensajes por contenido
    @Query("""
        SELECT m FROM Message m 
        WHERE m.conversation.id = :conversationId 
          AND LOWER(m.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
          AND m.isDeleted = false
        ORDER BY m.createdAt DESC
        """)
    List<Message> searchMessagesInConversation(@Param("conversationId") Long conversationId, 
                                              @Param("searchTerm") String searchTerm);
}