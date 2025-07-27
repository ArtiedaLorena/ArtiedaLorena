import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userAPI, matchAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  X, 
  Star, 
  MapPin, 
  Calendar,
  Info,
  Settings,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const DiscoverPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 99,
    maxDistance: 25,
  });

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation && user) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await userAPI.updateLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          } catch (error) {
            console.error('Error updating location:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('No se pudo obtener tu ubicación. Algunas funciones pueden estar limitadas.');
        }
      );
    }
  }, [user]);

  // Query para obtener usuarios potenciales
  const { data: potentialMatches, isLoading, refetch } = useQuery(
    ['potentialMatches', filters],
    () => userAPI.getPotentialMatches(filters),
    {
      select: (response) => response.data,
      onError: (error) => {
        toast.error('Error al cargar usuarios');
      },
    }
  );

  // Mutation para crear match
  const createMatchMutation = useMutation(matchAPI.createMatch, {
    onSuccess: (response) => {
      const { isMutual } = response.data;
      if (isMutual) {
        toast.success('¡Es un match! 🎉', {
          duration: 5000,
        });
      }
      queryClient.invalidateQueries(['potentialMatches']);
      queryClient.invalidateQueries(['matches']);
    },
    onError: (error) => {
      toast.error('Error al procesar la acción');
    },
  });

  const handleSwipe = (direction, userId) => {
    if (direction === 'left') {
      // Dislike
      createMatchMutation.mutate({
        toUserId: userId,
        matchType: 'DISLIKE',
      });
    } else if (direction === 'right') {
      // Like
      createMatchMutation.mutate({
        toUserId: userId,
        matchType: 'LIKE',
      });
    }
    
    // Pasar a la siguiente tarjeta
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleSuperLike = (userId) => {
    createMatchMutation.mutate({
      toUserId: userId,
      matchType: 'SUPER_LIKE',
    });
    setCurrentCardIndex(prev => prev + 1);
  };

  const currentUser = potentialMatches?.[currentCardIndex];
  const remainingUsers = potentialMatches?.slice(currentCardIndex) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Buscando personas cerca de ti..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto pt-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between px-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Descubrir</h1>
              <p className="text-sm text-gray-600">
                {remainingUsers.length} personas cerca
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => refetch()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards Stack */}
        <div className="relative h-[600px] mx-4">
          {remainingUsers.length === 0 ? (
            <div className="card h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ¡No hay más personas por ahora!
              </h3>
              <p className="text-gray-600 mb-6">
                Vuelve más tarde o ajusta tus filtros para ver más perfiles
              </p>
              <button
                onClick={() => refetch()}
                className="btn-primary"
              >
                Buscar de nuevo
              </button>
            </div>
          ) : (
            remainingUsers.slice(0, 3).map((person, index) => (
              <UserCard
                key={person.id}
                user={person}
                index={index}
                isActive={index === 0}
                onSwipe={handleSwipe}
                onSuperLike={handleSuperLike}
              />
            ))
          )}
        </div>

        {/* Action Buttons */}
        {currentUser && (
          <div className="flex items-center justify-center space-x-6 mt-8 px-4">
            <button
              onClick={() => handleSwipe('left', currentUser.id)}
              className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              disabled={createMatchMutation.isLoading}
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => handleSuperLike(currentUser.id)}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
              disabled={createMatchMutation.isLoading}
            >
              <Star className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleSwipe('right', currentUser.id)}
              className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
              disabled={createMatchMutation.isLoading}
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <FiltersModal
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

// Componente de tarjeta de usuario
const UserCard = ({ user, index, isActive, onSwipe, onSuperLike }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 100 || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? 'right' : 'left';
      onSwipe(direction, user.id);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <motion.div
      className={clsx(
        'absolute inset-0 card overflow-hidden cursor-grab active:cursor-grabbing',
        index === 0 ? 'z-30' : index === 1 ? 'z-20' : 'z-10'
      )}
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : 0,
        opacity: isActive ? opacity : 1 - index * 0.1,
        scale: isActive ? 1 : 1 - index * 0.05,
      }}
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isActive ? handleDragEnd : undefined}
      whileTap={{ scale: isActive ? 0.95 : 1 }}
    >
      {/* Background Image */}
      <div className="relative h-full">
        {user.profilePictureUrl || user.photos?.[0]?.photoUrl ? (
          <img
            src={user.profilePictureUrl || user.photos[0].photoUrl}
            alt={user.firstName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-400">
              {user.firstName?.charAt(0)}
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-8 left-8 px-4 py-2 bg-green-500 text-white font-bold text-lg rounded-lg transform rotate-12"
          style={{
            opacity: useTransform(x, [0, 100], [0, 1]),
          }}
        >
          LIKE
        </motion.div>
        
        <motion.div
          className="absolute top-8 right-8 px-4 py-2 bg-red-500 text-white font-bold text-lg rounded-lg transform -rotate-12"
          style={{
            opacity: useTransform(x, [-100, 0], [1, 0]),
          }}
        >
          NOPE
        </motion.div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {user.firstName} {user.lastName}
                {user.age && (
                  <span className="text-xl font-normal ml-2">
                    {calculateAge(user.birthDate)}
                  </span>
                )}
              </h2>
              
              {user.bio && (
                <p className="text-white/90 text-sm mb-2 line-clamp-2">
                  {user.bio}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-white/80">
                {user.distanceKm && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{Math.round(user.distanceKm)} km</span>
                  </div>
                )}
                
                {user.lastActiveAt && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Activo recientemente</span>
                  </div>
                )}
              </div>

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.interests.slice(0, 3).map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                  {user.interests.length > 3 && (
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                      +{user.interests.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={() => onSuperLike(user.id)}
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors ml-4"
            >
              <Star className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Photo indicators */}
        {user.photos && user.photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex space-x-1">
            {user.photos.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={clsx(
                    'h-full bg-white rounded-full transition-all duration-300',
                    idx === 0 ? 'w-full' : 'w-0'
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Modal de filtros
const FiltersModal = ({ filters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSave = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rango de edad: {localFilters.minAge} - {localFilters.maxAge} años
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="18"
                max="99"
                value={localFilters.minAge}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  minAge: parseInt(e.target.value) 
                }))}
                className="flex-1"
              />
              <input
                type="range"
                min="18"
                max="99"
                value={localFilters.maxAge}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  maxAge: parseInt(e.target.value) 
                }))}
                className="flex-1"
              />
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Distancia máxima: {localFilters.maxDistance} km
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={localFilters.maxDistance}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                maxDistance: parseInt(e.target.value) 
              }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn-primary flex-1">
            Aplicar filtros
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscoverPage;