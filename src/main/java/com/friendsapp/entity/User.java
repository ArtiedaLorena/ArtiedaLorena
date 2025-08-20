package com.friendsapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    private LocalDate birthDate;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "profile_picture_url")
    private String profilePictureUrl;
    
    // Ubicación actual
    @Column(name = "current_latitude")
    private Double currentLatitude;
    
    @Column(name = "current_longitude")
    private Double currentLongitude;
    
    @Column(name = "location_updated_at")
    private LocalDateTime locationUpdatedAt;
    
    // Configuraciones de privacidad y preferencias
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;
    
    @Column(name = "show_distance", nullable = false)
    private Boolean showDistance = true;
    
    @Column(name = "show_age", nullable = false)
    private Boolean showAge = true;
    
    @Column(name = "max_distance_km")
    private Integer maxDistanceKm = 25;
    
    @Column(name = "min_age")
    private Integer minAge = 18;
    
    @Column(name = "max_age")
    private Integer maxAge = 99;
    
    // Intereses (almacenados como JSON o lista separada por comas)
    @ElementCollection
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    private List<String> interests = new ArrayList<>();
    
    // Imágenes adicionales del perfil
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserPhoto> photos = new ArrayList<>();
    
    // Matches y likes
    @OneToMany(mappedBy = "fromUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserMatch> sentMatches = new ArrayList<>();
    
    @OneToMany(mappedBy = "toUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserMatch> receivedMatches = new ArrayList<>();
    
    // Reportes
    @OneToMany(mappedBy = "reportedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserReport> receivedReports = new ArrayList<>();
    
    @OneToMany(mappedBy = "reporterUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserReport> sentReports = new ArrayList<>();
    
    // Campos de auditoría
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;
    
    // Roles y permisos
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    // Token para verificación de email
    @Column(name = "verification_token")
    private String verificationToken;
    
    @Column(name = "verification_token_expires_at")
    private LocalDateTime verificationTokenExpiresAt;
    
    // Token para reset de password
    @Column(name = "reset_password_token")
    private String resetPasswordToken;
    
    @Column(name = "reset_password_token_expires_at")
    private LocalDateTime resetPasswordTokenExpiresAt;
    
    public enum Gender {
        MALE, FEMALE, NON_BINARY, OTHER, PREFER_NOT_TO_SAY
    }
    
    public enum Role {
        USER, ADMIN, MODERATOR
    }
    
    // Métodos de utilidad
    public int getAge() {
        if (birthDate == null) return 0;
        return LocalDate.now().getYear() - birthDate.getYear();
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public boolean hasLocation() {
        return currentLatitude != null && currentLongitude != null;
    }
    
    public void updateLastActive() {
        this.lastActiveAt = LocalDateTime.now();
    }
}