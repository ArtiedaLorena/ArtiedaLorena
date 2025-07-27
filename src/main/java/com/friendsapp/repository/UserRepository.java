package com.friendsapp.repository;

import com.friendsapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmailOrUsername(String email, String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    Optional<User> findByVerificationToken(String token);
    
    Optional<User> findByResetPasswordToken(String token);
    
    // Buscar usuarios activos excluyendo el usuario actual
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.id != :currentUserId")
    Page<User> findActiveUsersExcludingCurrent(@Param("currentUserId") Long currentUserId, Pageable pageable);
    
    // Buscar usuarios por ubicación usando la fórmula de Haversine
    @Query(value = """
        SELECT u.*, 
               (6371 * acos(cos(radians(:latitude)) * cos(radians(u.current_latitude)) * 
                           cos(radians(u.current_longitude) - radians(:longitude)) + 
                           sin(radians(:latitude)) * sin(radians(u.current_latitude)))) AS distance
        FROM users u 
        WHERE u.is_active = true 
          AND u.id != :currentUserId
          AND u.current_latitude IS NOT NULL 
          AND u.current_longitude IS NOT NULL
          AND (6371 * acos(cos(radians(:latitude)) * cos(radians(u.current_latitude)) * 
                          cos(radians(u.current_longitude) - radians(:longitude)) + 
                          sin(radians(:latitude)) * sin(radians(u.current_latitude)))) <= :maxDistanceKm
        ORDER BY distance
        """, nativeQuery = true)
    List<Object[]> findUsersNearby(@Param("latitude") Double latitude, 
                                  @Param("longitude") Double longitude,
                                  @Param("maxDistanceKm") Double maxDistanceKm,
                                  @Param("currentUserId") Long currentUserId);
    
    // Buscar usuarios que no han sido evaluados por el usuario actual
    @Query("""
        SELECT u FROM User u 
        WHERE u.isActive = true 
          AND u.id != :currentUserId
          AND u.id NOT IN (
              SELECT m.toUser.id FROM UserMatch m 
              WHERE m.fromUser.id = :currentUserId
          )
        """)
    Page<User> findPotentialMatches(@Param("currentUserId") Long currentUserId, Pageable pageable);
    
    // Buscar usuarios por intereses comunes
    @Query("""
        SELECT DISTINCT u FROM User u 
        JOIN u.interests i 
        WHERE u.isActive = true 
          AND u.id != :currentUserId
          AND i IN :interests
        """)
    List<User> findUsersByCommonInterests(@Param("currentUserId") Long currentUserId, 
                                         @Param("interests") List<String> interests);
    
    // Buscar usuarios por rango de edad
    @Query("""
        SELECT u FROM User u 
        WHERE u.isActive = true 
          AND u.id != :currentUserId
          AND YEAR(CURRENT_DATE) - YEAR(u.birthDate) BETWEEN :minAge AND :maxAge
        """)
    List<User> findUsersByAgeRange(@Param("currentUserId") Long currentUserId,
                                  @Param("minAge") Integer minAge,
                                  @Param("maxAge") Integer maxAge);
    
    // Buscar usuarios activos recientemente
    @Query("SELECT u FROM User u WHERE u.lastActiveAt >= :since ORDER BY u.lastActiveAt DESC")
    List<User> findRecentlyActiveUsers(@Param("since") LocalDateTime since);
    
    // Contar usuarios activos
    long countByIsActiveTrue();
}