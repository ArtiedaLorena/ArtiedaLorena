import React, { useState } from 'react';
import { User, Camera, Edit2 } from 'react-feather';

const UserAvatar = ({ 
  user, 
  size = 'md', 
  showStatus = true, 
  showEdit = false,
  onClick,
  className = '',
  editable = false,
  onEdit
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
    '3xl': 'w-5 h-5'
  };

  const editIconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
    '2xl': 'w-8 h-8',
    '3xl': 'w-10 h-10'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const renderAvatar = () => {
    if (imageError || !user?.photos || user.photos.length === 0) {
      return (
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold`}>
          {user?.name ? (
            <span className="text-xs">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className={editIconSizeClasses[size]} />
          )}
        </div>
      );
    }

    return (
      <img
        src={user.photos[0]}
        alt={`${user.name}'s avatar`}
        onError={handleImageError}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div
        className={`relative cursor-pointer transition-transform duration-200 ${
          onClick ? 'hover:scale-105' : ''
        }`}
        onClick={onClick}
      >
        {renderAvatar()}
        
        {/* Edit Overlay */}
        {editable && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Edit2 className={`${editIconSizeClasses[size]} text-white`} />
          </div>
        )}
        
        {/* Edit Button */}
        {showEdit && editable && (
          <button
            type="button"
            onClick={handleEditClick}
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Camera className={editIconSizeClasses[size]} />
          </button>
        )}
      </div>

      {/* Online Status */}
      {showStatus && user?.isOnline !== undefined && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <div className={`${statusSizeClasses[size]} ${getStatusColor(user.isOnline ? 'online' : 'offline')} rounded-full border-2 border-white`} />
        </div>
      )}

      {/* Custom Status */}
      {showStatus && user?.status && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <div className={`${statusSizeClasses[size]} ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
        </div>
      )}

      {/* Status Tooltip */}
      {showStatus && user?.status && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {getStatusText(user.status)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;