package com.friendsapp.controller;

import com.friendsapp.dto.MatchDTO;
import com.friendsapp.entity.UserMatch;
import com.friendsapp.service.MatchService;
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

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Matches", description = "Gestión de matches y likes")
public class MatchController {
    
    private final MatchService matchService;
    
    @PostMapping
    @Operation(summary = "Crear un nuevo match (like, dislike, super like)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Match creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o ya existe match"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MatchDTO> createMatch(@Valid @RequestBody CreateMatchRequest request) {
        MatchDTO match = matchService.createMatch(request.toUserId(), request.matchType());
        return ResponseEntity.ok(match);
    }
    
    @GetMapping
    @Operation(summary = "Obtener todos los matches del usuario actual")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Matches obtenidos exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<Page<MatchDTO>> getMatches(
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MatchDTO> matches = matchService.getMatches(pageable);
        return ResponseEntity.ok(matches);
    }
    
    @GetMapping("/mutual")
    @Operation(summary = "Obtener matches mutuos (conexiones)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Matches mutuos obtenidos exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<Page<MatchDTO>> getMutualMatches(
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MatchDTO> mutualMatches = matchService.getMutualMatches(pageable);
        return ResponseEntity.ok(mutualMatches);
    }
    
    @GetMapping("/pending")
    @Operation(summary = "Obtener likes pendientes (usuarios que te han dado like)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Likes pendientes obtenidos exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<Page<MatchDTO>> getPendingLikes(
            @Parameter(description = "Página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<MatchDTO> pendingLikes = matchService.getPendingLikes(pageable);
        return ResponseEntity.ok(pendingLikes);
    }
    
    @GetMapping("/by-type/{matchType}")
    @Operation(summary = "Obtener matches por tipo específico")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Matches obtenidos exitosamente"),
        @ApiResponse(responseCode = "400", description = "Tipo de match inválido"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<List<MatchDTO>> getMatchesByType(
            @Parameter(description = "Tipo de match") @PathVariable UserMatch.MatchType matchType) {
        
        List<MatchDTO> matches = matchService.getMatchesByType(matchType);
        return ResponseEntity.ok(matches);
    }
    
    @DeleteMapping("/{matchId}")
    @Operation(summary = "Eliminar un match")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Match eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Match no encontrado"),
        @ApiResponse(responseCode = "403", description = "No tienes permiso para eliminar este match"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> deleteMatch(
            @Parameter(description = "ID del match") @PathVariable Long matchId) {
        
        matchService.deleteMatch(matchId);
        return ResponseEntity.ok(new MessageResponse("Match eliminado exitosamente"));
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Obtener estadísticas de matches del usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MatchService.MatchStats> getMatchStats() {
        MatchService.MatchStats stats = matchService.getMatchStats();
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/unmatch/{userId}")
    @Operation(summary = "Deshacer match mutuo (unmatch)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Unmatch realizado exitosamente"),
        @ApiResponse(responseCode = "400", description = "No tienes match con este usuario"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MessageResponse> unmatch(
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        
        matchService.unmatch(userId);
        return ResponseEntity.ok(new MessageResponse("Unmatch realizado exitosamente"));
    }
    
    @GetMapping("/check-mutual/{userId}")
    @Operation(summary = "Verificar si hay match mutuo con un usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Verificación realizada exitosamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado")
    })
    public ResponseEntity<MutualMatchResponse> checkMutualMatch(
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        
        boolean hasMutualMatch = matchService.haveMutualMatch(userId, userId);
        return ResponseEntity.ok(new MutualMatchResponse(hasMutualMatch));
    }
    
    // DTOs para requests y responses
    public record CreateMatchRequest(
            @Parameter(description = "ID del usuario objetivo") Long toUserId,
            @Parameter(description = "Tipo de match") UserMatch.MatchType matchType
    ) {}
    
    public record MessageResponse(String message) {}
    
    public record MutualMatchResponse(boolean hasMutualMatch) {}
}