# 🤝 Friends Location App

Una aplicación tipo Tinder para hacer amigos basada en localización, desarrollada con **Spring Boot 3.5.1** y **Java 21**.

## 📋 Características Principales

### 🔐 Autenticación y Seguridad
- ✅ Registro de usuarios con validación completa
- ✅ Login con JWT (Access + Refresh tokens)
- ✅ Verificación de email
- ✅ Reset de contraseña
- ✅ Encriptación de contraseñas con BCrypt
- ✅ Validación de edad mínima (18 años)

### 👤 Gestión de Perfiles
- ✅ Perfiles completos con foto, biografía e intereses
- ✅ Múltiples fotos por usuario
- ✅ Configuraciones de privacidad personalizables
- ✅ Preferencias de edad y distancia

### 📍 Funcionalidades de Ubicación
- ✅ Búsqueda de usuarios por proximidad geográfica
- ✅ Cálculo de distancia usando fórmula de Haversine
- ✅ Filtros por distancia máxima configurable
- ✅ Actualización en tiempo real de ubicación

### 💕 Sistema de Matches
- ✅ Like/Dislike/Super Like
- ✅ Matches mutuos automáticos
- ✅ Algoritmo inteligente de recomendaciones
- ✅ Filtros por intereses comunes

### 💬 Chat en Tiempo Real
- ✅ Mensajería instantánea con WebSockets
- ✅ Mensajes de texto, imágenes y ubicación
- ✅ Estados de lectura (leído/no leído)
- ✅ Historial de conversaciones

### 🛡️ Moderación y Seguridad
- ✅ Sistema de reportes de usuarios
- ✅ Bloqueo de usuarios problemáticos
- ✅ Panel de administración
- ✅ Logs de auditoría

## 🚀 Tecnologías Utilizadas

### Backend
- **Spring Boot 3.5.1** - Framework principal
- **Java 21** - Lenguaje de programación
- **Spring Security** - Autenticación y autorización
- **JWT** - Tokens de autenticación
- **Spring Data JPA** - Persistencia de datos
- **PostgreSQL** - Base de datos principal
- **H2** - Base de datos para testing
- **Redis** - Cache y sesiones
- **WebSockets** - Chat en tiempo real
- **MapStruct** - Mapeo de DTOs
- **Lombok** - Reducción de código boilerplate

### Servicios Externos
- **Cloudinary** - Almacenamiento de imágenes
- **JavaMail** - Envío de emails
- **Swagger/OpenAPI** - Documentación de API

### Testing y Calidad
- **JUnit 5** - Testing unitario
- **Testcontainers** - Testing de integración
- **Spring Boot Test** - Testing de aplicación
- **Actuator** - Monitoreo y métricas

## 📦 Instalación y Configuración

### Prerrequisitos
- Java 21 o superior
- Maven 3.8+
- PostgreSQL 13+ (para producción)
- Redis 6+ (opcional, para cache)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/friends-location-app.git
cd friends-location-app
```

### 2. Configurar Base de Datos
```sql
-- Crear base de datos en PostgreSQL
CREATE DATABASE friends_app;
CREATE USER friends_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE friends_app TO friends_user;
```

### 3. Variables de Entorno
Crear archivo `.env` o configurar variables del sistema:

```bash
# Base de datos
DB_USERNAME=friends_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-minimum-256-bits

# Redis (opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Ejecutar la Aplicación

#### Desarrollo (con H2)
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

#### Producción (con PostgreSQL)
```bash
mvn clean package
java -jar target/friends-location-app-1.0.0.jar --spring.profiles.active=prod
```

### 5. Verificar Instalación
- **API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **H2 Console** (dev): http://localhost:8080/api/h2-console
- **Health Check**: http://localhost:8080/api/actuator/health

## 📚 Documentación de API

### Endpoints Principales

#### Autenticación
```http
POST /api/auth/register          # Registrar usuario
POST /api/auth/login             # Iniciar sesión
POST /api/auth/refresh           # Renovar token
POST /api/auth/verify-email      # Verificar email
POST /api/auth/forgot-password   # Solicitar reset
POST /api/auth/reset-password    # Restablecer contraseña
```

#### Usuarios
```http
GET    /api/users/profile        # Obtener perfil actual
PUT    /api/users/profile        # Actualizar perfil
POST   /api/users/photos         # Subir foto
DELETE /api/users/photos/{id}    # Eliminar foto
PUT    /api/users/location       # Actualizar ubicación
GET    /api/users/nearby         # Usuarios cercanos
```

#### Matches
```http
POST   /api/matches              # Crear match (like/dislike)
GET    /api/matches              # Obtener matches mutuos
GET    /api/matches/pending      # Likes pendientes
DELETE /api/matches/{id}         # Eliminar match
```

#### Chat
```http
GET    /api/conversations        # Listar conversaciones
GET    /api/conversations/{id}/messages  # Mensajes de conversación
POST   /api/conversations/{id}/messages  # Enviar mensaje
PUT    /api/messages/{id}/read    # Marcar como leído
```

#### WebSocket (Chat en tiempo real)
```javascript
// Conectar al WebSocket
const socket = new SockJS('/api/ws');
const stompClient = Stomp.over(socket);

// Suscribirse a conversación
stompClient.subscribe('/topic/conversation/{conversationId}', (message) => {
    const newMessage = JSON.parse(message.body);
    // Manejar nuevo mensaje
});

// Enviar mensaje
stompClient.send('/app/chat.send', {}, JSON.stringify({
    conversationId: 1,
    content: "Hola!",
    messageType: "TEXT"
}));
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
mvn test

# Tests de integración
mvn verify

# Tests con cobertura
mvn test jacoco:report
```

### Tests Incluidos
- ✅ Tests unitarios de servicios
- ✅ Tests de integración con Testcontainers
- ✅ Tests de controladores REST
- ✅ Tests de seguridad JWT
- ✅ Tests de repositorios JPA

## 🚀 Despliegue

### Docker
```dockerfile
FROM openjdk:21-jdk-slim

WORKDIR /app
COPY target/friends-location-app-1.0.0.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=postgres
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: friends_app
      POSTGRES_USER: friends_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 🔧 Configuración Avanzada

### Perfiles de Spring
- **dev**: Desarrollo con H2 y configuración debug
- **prod**: Producción con PostgreSQL y configuración optimizada
- **test**: Testing con base de datos en memoria

### Configuraciones Personalizables
```yaml
# application.yml
location:
  max-distance-km: 50        # Distancia máxima de búsqueda
  default-radius-km: 10      # Radio por defecto

jwt:
  expiration: 86400000       # 24 horas
  refresh-expiration: 604800000  # 7 días

websocket:
  allowed-origins: "*"       # Orígenes permitidos para WebSocket
```

## 📱 Cliente Frontend

La aplicación está diseñada como API REST y WebSocket, compatible con:
- **React Native** (iOS/Android)
- **Flutter** (multiplataforma)
- **React/Vue/Angular** (web)
- **Swift/Kotlin** (nativo)

### Ejemplo de integración React Native:
```javascript
// Configuración de API
const API_BASE_URL = 'http://localhost:8080/api';

// Login
const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

// Obtener usuarios cercanos
const getNearbyUsers = async (location) => {
  const response = await fetch(`${API_BASE_URL}/users/nearby`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para reportar bugs o solicitar nuevas funcionalidades:
- 🐛 [Issues](https://github.com/tu-usuario/friends-location-app/issues)
- 📧 Email: soporte@friendsapp.com
- 💬 [Discussions](https://github.com/tu-usuario/friends-location-app/discussions)

## 🙏 Agradecimientos

- Spring Boot Team por el excelente framework
- Comunidad de desarrolladores Java
- Contribuidores del proyecto

---

**¡Hecho con ❤️ para conectar personas y crear nuevas amistades!**