import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, clearAuthTokens, getCurrentUser } from '../utils/api';
import toast from 'react-hot-toast';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Tipos de acciones
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cargar usuario al inicializar la aplicación
  useEffect(() => {
    const loadUser = () => {
      try {
        const user = getCurrentUser();
        const token = localStorage.getItem('accessToken');
        
        if (user && token) {
          dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: user });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: null });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: null });
      }
    };

    loadUser();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken, user } = response.data;

      // Guardar tokens y usuario en localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });

      toast.success(`¡Bienvenido, ${user.firstName}!`);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authAPI.register(userData);
      const { accessToken, refreshToken, user } = response.data;

      // Guardar tokens y usuario en localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user },
      });

      toast.success('¡Cuenta creada exitosamente!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = () => {
    clearAuthTokens();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Sesión cerrada exitosamente');
  };

  // Función para actualizar el usuario
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  };

  // Función para verificar email
  const verifyEmail = async (token) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      await authAPI.verifyEmail(token);
      
      // Actualizar el estado del usuario como verificado
      updateUser({ isVerified: true });
      
      toast.success('Email verificado exitosamente');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al verificar el email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Función para reenviar verificación
  const resendVerification = async (email) => {
    try {
      await authAPI.resendVerification(email);
      toast.success('Email de verificación enviado');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al enviar el email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función para solicitar reset de contraseña
  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      toast.success('Si el email existe, recibirás instrucciones para restablecer tu contraseña');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al procesar la solicitud';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función para resetear contraseña
  const resetPassword = async (token, newPassword) => {
    try {
      await authAPI.resetPassword(token, newPassword);
      toast.success('Contraseña restablecida exitosamente');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer la contraseña';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Valor del contexto
  const value = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Acciones
    login,
    register,
    logout,
    updateUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;