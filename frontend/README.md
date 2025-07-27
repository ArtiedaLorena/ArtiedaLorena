# 🌐 Friends Location App - Frontend

Frontend React para la aplicación de amistad basada en localización.

## 🚀 Características

### ✨ **Interfaz Moderna**
- **Diseño responsivo** con Tailwind CSS
- **Animaciones fluidas** con Framer Motion
- **Componentes reutilizables** y modulares
- **Tema personalizado** con gradientes y efectos

### 🔐 **Autenticación Completa**
- Login/Registro con validación
- Formulario multi-paso para registro
- Verificación de email
- Reset de contraseña
- Gestión automática de tokens JWT

### 📱 **Experiencia Tipo Tinder**
- **Swipe cards** con gestos táctiles
- **Animaciones de swipe** (Like/Nope)
- **Stack de tarjetas** con efecto 3D
- **Filtros avanzados** (edad, distancia)
- **Indicadores visuales** de acciones

### 💬 **Chat en Tiempo Real**
- Mensajería instantánea
- Estados de lectura
- Historial de conversaciones
- Soporte para diferentes tipos de mensaje

### 🎨 **Componentes UI**
- Sistema de diseño consistente
- Loading states y skeletons
- Notificaciones toast
- Modales y overlays
- Navegación responsive

## 📦 Instalación

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Backend ejecutándose en puerto 8080

### 1. Instalar Dependencias
```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Crear archivo .env en frontend/
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=ws://localhost:8080/ws
REACT_APP_ENV=development
```

### 3. Ejecutar en Desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Build para Producción
```bash
npm run build
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Layout.js       # Layout principal
│   │   ├── LoadingSpinner.js
│   │   └── ProtectedRoute.js
│   ├── contexts/           # Context providers
│   │   └── AuthContext.js  # Gestión de autenticación
│   ├── pages/              # Páginas principales
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DiscoverPage.js # Página principal tipo Tinder
│   │   ├── MatchesPage.js
│   │   ├── MessagesPage.js
│   │   └── ProfilePage.js
│   ├── utils/              # Utilidades
│   │   └── api.js          # Configuración de Axios
│   ├── App.js              # Componente principal
│   ├── index.js           # Punto de entrada
│   └── index.css          # Estilos globales
├── package.json
├── tailwind.config.js     # Configuración de Tailwind
└── postcss.config.js
```

## 🎨 Sistema de Diseño

### Colores
```css
/* Primarios */
primary-500: #ef4444 (Rojo principal)
primary-600: #dc2626 (Rojo oscuro)

/* Secundarios */
secondary-500: #64748b (Gris azulado)
secondary-600: #475569 (Gris azulado oscuro)

/* Acentos */
accent-500: #d946ef (Magenta)
accent-600: #c026d3 (Magenta oscuro)
```

### Componentes CSS Personalizados
```css
/* Botones */
.btn-primary     /* Botón principal con gradiente */
.btn-secondary   /* Botón secundario blanco */
.btn-ghost       /* Botón transparente */
.btn-danger      /* Botón de peligro rojo */

/* Inputs */
.input-field     /* Campo de entrada estándar */
.input-error     /* Campo con error */

/* Cards */
.card            /* Tarjeta base */
.card-hover      /* Tarjeta con hover */

/* Animaciones */
.swipe-card      /* Animaciones de swipe */
.match-celebration /* Animación de match */
.loading-shimmer /* Efecto de carga */
```

### Breakpoints Responsivos
```css
xs: 475px    /* Móviles pequeños */
sm: 640px    /* Móviles */
md: 768px    /* Tablets */
lg: 1024px   /* Desktop */
xl: 1280px   /* Desktop grande */
```

## 🔧 Tecnologías Utilizadas

### **Core**
- **React 18** - Biblioteca principal
- **React Router 6** - Enrutamiento
- **React Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP

### **UI/UX**
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

### **Formularios**
- **React Hook Form** - Gestión de formularios
- **React Dropzone** - Subida de archivos

### **Utilidades**
- **clsx** - Concatenación de clases CSS
- **date-fns** - Manipulación de fechas
- **SockJS/STOMP** - WebSockets para chat

## 📱 Páginas y Funcionalidades

### **🔐 Autenticación**
- **LoginPage** - Inicio de sesión
- **RegisterPage** - Registro multi-paso
- **ForgotPasswordPage** - Recuperar contraseña
- **VerifyEmailPage** - Verificación de email

### **🏠 Aplicación Principal**
- **DiscoverPage** - Descubrimiento tipo Tinder
- **MatchesPage** - Lista de matches
- **MessagesPage** - Lista de conversaciones
- **ChatPage** - Chat individual
- **ProfilePage** - Perfil del usuario
- **SettingsPage** - Configuraciones

### **📄 Páginas Estáticas**
- **LandingPage** - Página de inicio
- **TermsPage** - Términos de servicio
- **PrivacyPage** - Política de privacidad
- **NotFoundPage** - Error 404

## 🎯 Funcionalidades Principales

### **Descubrimiento de Usuarios**
```javascript
// Swipe gestures con Framer Motion
const handleDragEnd = (event, info) => {
  const offset = info.offset.x;
  if (Math.abs(offset) > 100) {
    const direction = offset > 0 ? 'right' : 'left';
    onSwipe(direction, user.id);
  }
};
```

### **Gestión de Estado**
```javascript
// React Query para cache inteligente
const { data: matches, isLoading } = useQuery(
  ['matches'],
  () => matchAPI.getMatches(),
  { staleTime: 5 * 60 * 1000 }
);
```

### **Autenticación Persistente**
```javascript
// Context con localStorage
const { user, isAuthenticated, login, logout } = useAuth();
```

## 🔌 Integración con Backend

### **Configuración de API**
```javascript
// utils/api.js
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Interceptor para tokens automáticos
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **Endpoints Principales**
```javascript
// Autenticación
authAPI.login(credentials)
authAPI.register(userData)

// Usuarios
userAPI.getPotentialMatches(filters)
userAPI.updateLocation(location)

// Matches
matchAPI.createMatch(matchData)
matchAPI.getMatches()

// Chat
chatAPI.getConversations()
chatAPI.sendMessage(conversationId, message)
```

## 🚀 Despliegue

### **Build de Producción**
```bash
npm run build
```

### **Variables de Entorno para Producción**
```bash
REACT_APP_API_URL=https://api.friendsapp.com/api
REACT_APP_WS_URL=wss://api.friendsapp.com/ws
REACT_APP_ENV=production
```

### **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name friendsapp.com;
    
    location / {
        root /var/www/friends-app;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🧪 Testing

### **Ejecutar Tests**
```bash
npm test
```

### **Tests de Componentes**
```javascript
// Ejemplo de test con React Testing Library
import { render, screen } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
});
```

## 🔧 Desarrollo

### **Scripts Disponibles**
```json
{
  "start": "react-scripts start",      // Desarrollo
  "build": "react-scripts build",      // Producción
  "test": "react-scripts test",        // Tests
  "lint": "eslint src --ext .js,.jsx", // Linter
  "lint:fix": "eslint src --fix"       // Fix automático
}
```

### **Hot Reload**
Los cambios se reflejan automáticamente en desarrollo.

### **Proxy para Backend**
```json
// package.json
{
  "proxy": "http://localhost:8080"
}
```

## 📱 Responsive Design

### **Mobile First**
- Diseño optimizado para móviles
- Navegación bottom tab en móvil
- Gestos táctiles para swipe
- Safe areas para dispositivos con notch

### **Desktop**
- Sidebar navigation
- Hover states
- Keyboard shortcuts
- Multi-column layouts

## 🎨 Personalización

### **Temas**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* colores personalizados */ },
        secondary: { /* colores personalizados */ },
      },
      animation: {
        'custom-bounce': 'bounce 1s infinite',
      },
    },
  },
};
```

### **Componentes Personalizados**
```javascript
// Crear nuevos componentes en src/components/
export const CustomButton = ({ variant, children, ...props }) => {
  return (
    <button 
      className={`btn-${variant}`} 
      {...props}
    >
      {children}
    </button>
  );
};
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**¡Hecho con ❤️ y React para conectar personas!**