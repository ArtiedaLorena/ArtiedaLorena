package com.friendsapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@friendsapp.com}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    @Async
    public void sendVerificationEmail(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Verifica tu cuenta - Friends App");
            
            String verificationUrl = frontendUrl + "/verify-email?token=" + token;
            String content = String.format(
                "¡Bienvenido a Friends App!\n\n" +
                "Para completar tu registro, por favor verifica tu email haciendo clic en el siguiente enlace:\n\n" +
                "%s\n\n" +
                "Este enlace expirará en 24 horas.\n\n" +
                "Si no creaste una cuenta en Friends App, puedes ignorar este email.\n\n" +
                "¡Gracias por unirte a nuestra comunidad!",
                verificationUrl
            );
            
            message.setText(content);
            
            mailSender.send(message);
            log.info("Email de verificación enviado a: {}", to);
            
        } catch (Exception e) {
            log.error("Error enviando email de verificación a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error enviando email de verificación", e);
        }
    }
    
    @Async
    public void sendPasswordResetEmail(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Restablecer contraseña - Friends App");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            String content = String.format(
                "Hola,\n\n" +
                "Recibimos una solicitud para restablecer la contraseña de tu cuenta en Friends App.\n\n" +
                "Para restablecer tu contraseña, haz clic en el siguiente enlace:\n\n" +
                "%s\n\n" +
                "Este enlace expirará en 1 hora por motivos de seguridad.\n\n" +
                "Si no solicitaste restablecer tu contraseña, puedes ignorar este email. Tu contraseña permanecerá sin cambios.\n\n" +
                "Saludos,\nEl equipo de Friends App",
                resetUrl
            );
            
            message.setText(content);
            
            mailSender.send(message);
            log.info("Email de reset de contraseña enviado a: {}", to);
            
        } catch (Exception e) {
            log.error("Error enviando email de reset a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error enviando email de reset", e);
        }
    }
    
    @Async
    public void sendWelcomeEmail(String to, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("¡Bienvenido a Friends App!");
            
            String content = String.format(
                "¡Hola %s!\n\n" +
                "¡Bienvenido a Friends App! Estamos emocionados de tenerte en nuestra comunidad.\n\n" +
                "Ahora puedes:\n" +
                "• Completar tu perfil con fotos e intereses\n" +
                "• Descubrir personas cerca de ti\n" +
                "• Hacer nuevos amigos y conectar\n" +
                "• Chatear con tus matches\n\n" +
                "¡Esperamos que disfrutes conociendo gente nueva!\n\n" +
                "Saludos,\nEl equipo de Friends App",
                firstName
            );
            
            message.setText(content);
            
            mailSender.send(message);
            log.info("Email de bienvenida enviado a: {}", to);
            
        } catch (Exception e) {
            log.error("Error enviando email de bienvenida a {}: {}", to, e.getMessage());
        }
    }
    
    @Async
    public void sendNewMatchNotification(String to, String matchName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("¡Nuevo match en Friends App!");
            
            String content = String.format(
                "¡Felicidades!\n\n" +
                "Tienes un nuevo match con %s en Friends App.\n\n" +
                "¡Ahora pueden empezar a chatear y conocerse mejor!\n\n" +
                "Inicia sesión en la app para empezar la conversación.\n\n" +
                "¡Que disfrutes conociendo a tu nuevo amigo!\n\n" +
                "Saludos,\nEl equipo de Friends App",
                matchName
            );
            
            message.setText(content);
            
            mailSender.send(message);
            log.info("Notificación de nuevo match enviada a: {}", to);
            
        } catch (Exception e) {
            log.error("Error enviando notificación de match a {}: {}", to, e.getMessage());
        }
    }
}