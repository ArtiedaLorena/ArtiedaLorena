package com.friendsapp.repository;

import com.friendsapp.entity.UserMatch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMatchRepository extends JpaRepository<UserMatch, Long> {
    
    // Buscar match entre dos usuarios específicos
    Optional<UserMatch> findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);
    
    // Verificar si existe un match entre dos usuarios
    boolean existsByFromUserIdAndToUserId(Long fromUserId, Long toUserId);
    
    // Obtener todos los matches enviados por un usuario
    Page<UserMatch> findByFromUserIdOrderByCreatedAtDesc(Long fromUserId, Pageable pageable);
    
    // Obtener todos los matches recibidos por un usuario
    Page<UserMatch> findByToUserIdOrderByCreatedAtDesc(Long toUserId, Pageable pageable);
    
    // Obtener matches mutuos (matches bidireccionales)
    @Query("""
        SELECT m1 FROM UserMatch m1 
        WHERE m1.fromUser.id = :userId 
          AND m1.matchType = 'LIKE'
          AND EXISTS (
              SELECT m2 FROM UserMatch m2 
              WHERE m2.fromUser.id = m1.toUser.id 
                AND m2.toUser.id = :userId 
                AND m2.matchType = 'LIKE'
          )
        ORDER BY m1.createdAt DESC
        """)
    List<UserMatch> findMutualMatches(@Param("userId") Long userId);
    
    // Obtener matches mutuos paginados
    @Query("""
        SELECT m1 FROM UserMatch m1 
        WHERE m1.fromUser.id = :userId 
          AND m1.matchType = 'LIKE'
          AND EXISTS (
              SELECT m2 FROM UserMatch m2 
              WHERE m2.fromUser.id = m1.toUser.id 
                AND m2.toUser.id = :userId 
                AND m2.matchType = 'LIKE'
          )
        ORDER BY m1.createdAt DESC
        """)
    Page<UserMatch> findMutualMatches(@Param("userId") Long userId, Pageable pageable);
    
    // Obtener likes recibidos que aún no han sido correspondidos
    @Query("""
        SELECT m FROM UserMatch m 
        WHERE m.toUser.id = :userId 
          AND m.matchType = 'LIKE'
          AND NOT EXISTS (
              SELECT m2 FROM UserMatch m2 
              WHERE m2.fromUser.id = :userId 
                AND m2.toUser.id = m.fromUser.id
          )
        ORDER BY m.createdAt DESC
        """)
    Page<UserMatch> findPendingLikes(@Param("userId") Long userId, Pageable pageable);
    
    // Contar likes enviados por un usuario
    long countByFromUserIdAndMatchType(Long fromUserId, UserMatch.MatchType matchType);
    
    // Contar likes recibidos por un usuario
    long countByToUserIdAndMatchType(Long toUserId, UserMatch.MatchType matchType);
    
    // Obtener matches por tipo
    List<UserMatch> findByFromUserIdAndMatchType(Long fromUserId, UserMatch.MatchType matchType);
    
    // Verificar si dos usuarios tienen match mutuo
    @Query("""
        SELECT CASE WHEN COUNT(m1) > 0 AND COUNT(m2) > 0 THEN true ELSE false END
        FROM UserMatch m1, UserMatch m2
        WHERE m1.fromUser.id = :user1Id 
          AND m1.toUser.id = :user2Id 
          AND m1.matchType = 'LIKE'
          AND m2.fromUser.id = :user2Id 
          AND m2.toUser.id = :user1Id 
          AND m2.matchType = 'LIKE'
        """)
    boolean haveMutualMatch(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}