import axios from 'axios';
import toast from 'react-hot-toast';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró, intentar renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si no se puede renovar el token, redirigir al login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Manejar otros errores
    const errorMessage = error.response?.data?.message || 'Ha ocurrido un error';
    
    // No mostrar toast para errores 401 (ya se maneja el redirect)
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  verifyEmail: (token) => api.post(`/auth/verify-email?token=${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

// Funciones de usuario
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  uploadPhoto: (formData) => api.post('/users/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePhoto: (photoId) => api.delete(`/users/photos/${photoId}`),
  updateLocation: (location) => api.put('/users/location', location),
  getNearbyUsers: (params) => api.get('/users/nearby', { params }),
  getPotentialMatches: (params) => api.get('/users/potential-matches', { params }),
  getUserById: (userId) => api.get(`/users/${userId}`),
};

// Funciones de matches
export const matchAPI = {
  createMatch: (matchData) => api.post('/matches', matchData),
  getMatches: (params) => api.get('/matches', { params }),
  getPendingLikes: (params) => api.get('/matches/pending', { params }),
  deleteMatch: (matchId) => api.delete(`/matches/${matchId}`),
  getMutualMatches: (params) => api.get('/matches/mutual', { params }),
};

// Funciones de conversaciones
export const chatAPI = {
  getConversations: (params) => api.get('/conversations', { params }),
  getConversation: (conversationId) => api.get(`/conversations/${conversationId}`),
  getMessages: (conversationId, params) => api.get(`/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, messageData) => api.post(`/conversations/${conversationId}/messages`, messageData),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

// Funciones de reportes
export const reportAPI = {
  reportUser: (reportData) => api.post('/reports', reportData),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
};

// Funciones de utilidad
export const utilAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getInterests: () => api.get('/interests'),
  searchUsers: (query, params) => api.get(`/users/search?q=${query}`, { params }),
};

// Función para obtener la URL completa de una imagen
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}/images/${imagePath}`;
};

// Función para manejar errores de forma consistente
export const handleApiError = (error, defaultMessage = 'Ha ocurrido un error') => {
  const message = error.response?.data?.message || defaultMessage;
  console.error('API Error:', error);
  return message;
};

// Función para limpiar tokens al hacer logout
export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// Función para obtener el usuario actual del localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export default api;