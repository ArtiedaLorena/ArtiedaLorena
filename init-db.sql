-- Script de inicialización para la base de datos Friends App
-- Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear índices para mejorar el rendimiento de consultas geográficas
-- Estos índices se crearán automáticamente cuando Hibernate genere las tablas

-- Función para calcular distancia (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DOUBLE PRECISION,
    lon1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION,
    lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
BEGIN
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * 
            cos(radians(lat2)) * 
            cos(radians(lon2) - radians(lon1)) + 
            sin(radians(lat1)) * 
            sin(radians(lat2))
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Datos de ejemplo para desarrollo (opcional)
-- Estos datos se insertarán después de que Hibernate cree las tablas

-- Comentario: Los datos de ejemplo se pueden insertar manualmente o a través de la aplicación
-- INSERT INTO users (email, password, first_name, last_name, username, birth_date, gender, bio, is_active, is_verified, role, created_at, updated_at)
-- VALUES 
-- ('admin@friendsapp.com', '$2a$10$example_hashed_password', 'Admin', 'User', 'admin', '1990-01-01', 'OTHER', 'Administrador del sistema', true, true, 'ADMIN', NOW(), NOW()),
-- ('demo@friendsapp.com', '$2a$10$example_hashed_password', 'Demo', 'User', 'demo', '1995-05-15', 'NON_BINARY', 'Usuario de demostración', true, true, 'USER', NOW(), NOW());

-- Configuraciones adicionales
ALTER DATABASE friends_app SET timezone TO 'UTC';

-- Comentarios informativos
COMMENT ON DATABASE friends_app IS 'Base de datos para la aplicación Friends Location App';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos Friends App inicializada correctamente';
END $$;