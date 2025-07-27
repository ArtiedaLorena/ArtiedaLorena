package com.friendsapp.repository;

import com.friendsapp.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    // Buscar conversación entre dos usuarios específicos
    @Query("""
        SELECT c FROM Conversation c 
        WHERE (c.user1.id = :user1Id AND c.user2.id = :user2Id) 
           OR (c.user1.id = :user2Id AND c.user2.id = :user1Id)
        """)
    Optional<Conversation> findByUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    // Obtener todas las conversaciones de un usuario ordenadas por último mensaje
    @Query("""
        SELECT c FROM Conversation c 
        WHERE (c.user1.id = :userId OR c.user2.id = :userId) 
          AND c.isActive = true
        ORDER BY c.lastMessageAt DESC NULLS LAST, c.createdAt DESC
        """)
    Page<Conversation> findUserConversations(@Param("userId") Long userId, Pageable pageable);
    
    // Contar conversaciones activas de un usuario
    @Query("""
        SELECT COUNT(c) FROM Conversation c 
        WHERE (c.user1.id = :userId OR c.user2.id = :userId) 
          AND c.isActive = true
        """)
    long countActiveConversations(@Param("userId") Long userId);
    
    // Verificar si existe conversación entre dos usuarios
    @Query("""
        SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END 
        FROM Conversation c 
        WHERE ((c.user1.id = :user1Id AND c.user2.id = :user2Id) 
            OR (c.user1.id = :user2Id AND c.user2.id = :user1Id))
          AND c.isActive = true
        """)
    boolean existsActiveConversationBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}