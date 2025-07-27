package com.friendsapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    
    @NotBlank(message = "El email o nombre de usuario es obligatorio")
    private String emailOrUsername;
    
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}