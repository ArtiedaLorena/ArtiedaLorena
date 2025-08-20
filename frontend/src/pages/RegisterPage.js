import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Calendar,
  Check
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    trigger,
  } = useForm();

  const watchedPassword = watch('password');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/discover', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateStep = async (step) => {
    const fieldsToValidate = {
      1: ['firstName', 'lastName', 'email'],
      2: ['username', 'password', 'confirmPassword'],
      3: ['birthDate', 'gender', 'acceptTerms'],
    };

    const isValid = await trigger(fieldsToValidate[step]);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      password: data.password,
      birthDate: data.birthDate,
      gender: data.gender,
      bio: data.bio || '',
      interests: [],
      acceptTerms: data.acceptTerms,
    });

    if (!result.success) {
      setError('root', {
        type: 'manual',
        message: result.error,
      });
    }
  };

  const genderOptions = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Femenino' },
    { value: 'NON_BINARY', label: 'No binario' },
    { value: 'OTHER', label: 'Otro' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefiero no decir' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-500 via-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Únete a nuestra comunidad
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-md">
              Crea tu perfil y comienza a conocer personas increíbles en tu área
            </p>
            
            {/* Step Indicators */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${step < 3 ? 'mr-4' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-white text-primary-600'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {step < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step < currentStep ? 'bg-white' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-white/80">
              <p className="font-medium">
                {currentStep === 1 && 'Información básica'}
                {currentStep === 2 && 'Credenciales de acceso'}
                {currentStep === 3 && 'Detalles del perfil'}
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">FriendsApp</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Crear cuenta nueva
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Paso {currentStep} de 3 - {
                currentStep === 1 ? 'Información básica' :
                currentStep === 2 ? 'Credenciales de acceso' :
                'Detalles del perfil'
              }
            </p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('firstName', {
                          required: 'El nombre es obligatorio',
                          minLength: {
                            value: 2,
                            message: 'El nombre debe tener al menos 2 caracteres',
                          },
                          maxLength: {
                            value: 50,
                            message: 'El nombre no puede exceder 50 caracteres',
                          },
                        })}
                        type="text"
                        className={`input-field pl-10 ${errors.firstName ? 'input-error' : ''}`}
                        placeholder="Tu nombre"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('lastName', {
                          required: 'El apellido es obligatorio',
                          minLength: {
                            value: 2,
                            message: 'El apellido debe tener al menos 2 caracteres',
                          },
                          maxLength: {
                            value: 50,
                            message: 'El apellido no puede exceder 50 caracteres',
                          },
                        })}
                        type="text"
                        className={`input-field pl-10 ${errors.lastName ? 'input-error' : ''}`}
                        placeholder="Tu apellido"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('email', {
                          required: 'El email es obligatorio',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido',
                          },
                        })}
                        type="email"
                        className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
                        placeholder="tu@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Credentials */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de usuario
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('username', {
                          required: 'El nombre de usuario es obligatorio',
                          minLength: {
                            value: 3,
                            message: 'Debe tener al menos 3 caracteres',
                          },
                          maxLength: {
                            value: 30,
                            message: 'No puede exceder 30 caracteres',
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Solo letras, números y guiones bajos',
                          },
                        })}
                        type="text"
                        className={`input-field pl-10 ${errors.username ? 'input-error' : ''}`}
                        placeholder="nombre_usuario"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('password', {
                          required: 'La contraseña es obligatoria',
                          minLength: {
                            value: 8,
                            message: 'Debe tener al menos 8 caracteres',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                            message: 'Debe contener mayúscula, minúscula y número',
                          },
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={`input-field pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                        placeholder="Tu contraseña"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('confirmPassword', {
                          required: 'Confirma tu contraseña',
                          validate: (value) =>
                            value === watchedPassword || 'Las contraseñas no coinciden',
                        })}
                        type="password"
                        className={`input-field pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Confirma tu contraseña"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Profile Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de nacimiento
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('birthDate', {
                          required: 'La fecha de nacimiento es obligatoria',
                          validate: (value) => {
                            const birthDate = new Date(value);
                            const today = new Date();
                            const age = today.getFullYear() - birthDate.getFullYear();
                            return age >= 18 || 'Debes ser mayor de 18 años';
                          },
                        })}
                        type="date"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        className={`input-field pl-10 ${errors.birthDate ? 'input-error' : ''}`}
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Género
                    </label>
                    <select
                      {...register('gender', {
                        required: 'Selecciona tu género',
                      })}
                      className={`input-field ${errors.gender ? 'input-error' : ''}`}
                    >
                      <option value="">Selecciona tu género</option>
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  {/* Bio (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía (opcional)
                    </label>
                    <textarea
                      {...register('bio', {
                        maxLength: {
                          value: 500,
                          message: 'La biografía no puede exceder 500 caracteres',
                        },
                      })}
                      rows={3}
                      className={`input-field resize-none ${errors.bio ? 'input-error' : ''}`}
                      placeholder="Cuéntanos un poco sobre ti..."
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        {...register('acceptTerms', {
                          required: 'Debes aceptar los términos y condiciones',
                        })}
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-700">
                        Acepto los{' '}
                        <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                          Términos de Servicio
                        </Link>{' '}
                        y la{' '}
                        <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                          Política de Privacidad
                        </Link>
                      </label>
                    </div>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-600">
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Error Message */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary flex-1"
                  >
                    Anterior
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex-1"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="btn-secondary w-full text-center block"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;