package com.friendsapp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {
    
    private final Cloudinary cloudinary;
    
    @Value("${cloudinary.folder:friends-app}")
    private String folder;
    
    public String uploadImage(MultipartFile file) throws IOException {
        try {
            // Generar nombre único para el archivo
            String publicId = folder + "/" + UUID.randomUUID().toString();
            
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", folder,
                "resource_type", "image",
                "transformation", ObjectUtils.asMap(
                    "quality", "auto:good",
                    "fetch_format", "auto",
                    "width", 800,
                    "height", 800,
                    "crop", "fill",
                    "gravity", "face"
                )
            );
            
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            
            String imageUrl = (String) uploadResult.get("secure_url");
            log.info("Imagen subida exitosamente a Cloudinary: {}", imageUrl);
            
            return imageUrl;
            
        } catch (IOException e) {
            log.error("Error subiendo imagen a Cloudinary: {}", e.getMessage());
            throw new IOException("Error al subir la imagen", e);
        }
    }
    
    public void deleteImage(String imageUrl) {
        try {
            // Extraer public_id de la URL
            String publicId = extractPublicIdFromUrl(imageUrl);
            
            if (publicId != null) {
                Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Imagen eliminada de Cloudinary: {}", publicId);
            }
            
        } catch (Exception e) {
            log.error("Error eliminando imagen de Cloudinary: {}", e.getMessage());
            // No lanzamos excepción para no interrumpir el flujo principal
        }
    }
    
    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            // Extraer el public_id de una URL de Cloudinary
            // Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
            String[] parts = imageUrl.split("/");
            
            // Buscar la parte después de "upload/"
            for (int i = 0; i < parts.length - 1; i++) {
                if ("upload".equals(parts[i])) {
                    // Saltar la versión si existe (v1234567890)
                    int startIndex = i + 1;
                    if (parts[startIndex].startsWith("v") && parts[startIndex].length() > 1) {
                        startIndex++;
                    }
                    
                    // Construir public_id
                    StringBuilder publicId = new StringBuilder();
                    for (int j = startIndex; j < parts.length; j++) {
                        if (j > startIndex) {
                            publicId.append("/");
                        }
                        // Remover extensión del último elemento
                        if (j == parts.length - 1) {
                            String filename = parts[j];
                            int dotIndex = filename.lastIndexOf('.');
                            if (dotIndex > 0) {
                                filename = filename.substring(0, dotIndex);
                            }
                            publicId.append(filename);
                        } else {
                            publicId.append(parts[j]);
                        }
                    }
                    
                    return publicId.toString();
                }
            }
            
        } catch (Exception e) {
            log.error("Error extrayendo public_id de URL: {}", e.getMessage());
        }
        
        return null;
    }
}