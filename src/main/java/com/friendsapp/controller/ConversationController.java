package com.friendsapp.controller;

import com.friendsapp.dto.ConversationDTO;
import com.friendsapp.dto.MessageDTO;
import com.friendsapp.entity.Message;
import com.friendsapp.service.ConversationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Conversations", description = "Gestión de conversaciones y mensajes")
public class ConversationController {
    
    private final ConversationService conversationService;
    
    @GetMapping
    @Operation(summary = "Obtener todas las conversaciones del usuario actual")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Conversaciones obtenidas exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<Page<ConversationDTO>> getUserConversations(
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ConversationDTO> conversations = conversationService.getUserConversations(pageable);
        return ResponseEntity.ok(conversations);
    }
    
    @GetMapping("/{conversationId}")
    @Operation(summary = "Obtener detalles de una conversación específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Conversación obtenida exitosamente"),
        @ApiResponse(responseCode = "404", description = "Conversación no encontrada"),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a esta conversación"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<ConversationDTO> getConversation(
            @Parameter(description = "ID de la conversación") @PathVariable Long conversationId) {
        
        ConversationDTO conversation = conversationService.getConversation(conversationId);
        return ResponseEntity.ok(conversation);
    }
    
    @GetMapping("/{conversationId}/messages")
    @Operation(summary = "Obtener mensajes de una conversación")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mensajes obtenidos exitosamente"),
        @ApiResponse(responseCode = "404", description = "Conversación no encontrada"),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a esta conversación"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<Page<MessageDTO>> getMessages(
            @Parameter(description = "ID de la conversación") @PathVariable Long conversationId,
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "50") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MessageDTO> messages = conversationService.getMessages(conversationId, pageable);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/{conversationId}/messages")
    @Operation(summary = "Enviar un mensaje en una conversación")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mensaje enviado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos del mensaje inválidos"),
        @ApiResponse(responseCode = "404", description = "Conversación no encontrada"),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a esta conversación"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageDTO> sendMessage(
            @Parameter(description = "ID de la conversación") @PathVariable Long conversationId,
            @Valid @RequestBody SendMessageRequest request) {
        
        MessageDTO message = conversationService.sendMessage(
                conversationId, 
                request.content(), 
                request.messageType()
        );
        return ResponseEntity.ok(message);
    }
    
    @PutMapping("/{conversationId}/read")
    @Operation(summary = "Marcar mensajes como leídos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mensajes marcados como leídos exitosamente"),
        @ApiResponse(responseCode = "404", description = "Conversación no encontrada"),
        @ApiResponse(responseCode = "403", description = "No tienes acceso a esta conversación"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> markMessagesAsRead(
            @Parameter(description = "ID de la conversación") @PathVariable Long conversationId) {
        
        conversationService.markMessagesAsRead(conversationId);
        return ResponseEntity.ok(new MessageResponse("Mensajes marcados como leídos"));
    }
    
    @DeleteMapping("/messages/{messageId}")
    @Operation(summary = "Eliminar un mensaje")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mensaje eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Mensaje no encontrado"),
        @ApiResponse(responseCode = "403", description = "No puedes eliminar este mensaje"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> deleteMessage(
            @Parameter(description = "ID del mensaje") @PathVariable Long messageId) {
        
        conversationService.deleteMessage(messageId);
        return ResponseEntity.ok(new MessageResponse("Mensaje eliminado exitosamente"));
    }
    
    @GetMapping("/unread-count")
    @Operation(summary = "Obtener contador de mensajes no leídos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contador obtenido exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<UnreadCountResponse> getUnreadMessagesCount() {
        long unreadCount = conversationService.getUnreadMessagesCount();
        return ResponseEntity.ok(new UnreadCountResponse(unreadCount));
    }
    
    @GetMapping("/check-active/{userId}")
    @Operation(summary = "Verificar si hay conversación activa con un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Verificación realizada exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<ActiveConversationResponse> hasActiveConversation(
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        
        boolean hasActive = conversationService.hasActiveConversation(userId, userId);
        return ResponseEntity.ok(new ActiveConversationResponse(hasActive));
    }
    
    // DTOs para requests y responses
    public record SendMessageRequest(
            @Parameter(description = "Contenido del mensaje") String content,
            @Parameter(description = "Tipo de mensaje") Message.MessageType messageType
    ) {}
    
    public record MessageResponse(String message) {}
    
    public record UnreadCountResponse(long unreadCount) {}
    
    public record ActiveConversationResponse(boolean hasActiveConversation) {}
}