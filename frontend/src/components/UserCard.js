import React, { useState } from 'react';
import { Heart, X, Star, MapPin, Calendar, MessageCircle } from 'react-feather';

const UserCard = ({ user, onLike, onDislike, onSuperLike, onMessage, showActions = true }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(true);
    onLike?.(user.id);
  };

  const handleDislike = () => {
    setIsDisliked(true);
    onDislike?.(user.id);
  };

  const handleSuperLike = () => {
    setIsLiked(true);
    onSuperLike?.(user.id);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === user.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? user.photos.length - 1 : prev - 1
    );
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm w-full">
      {/* Photo Section */}
      <div className="relative h-96 bg-gray-200">
        {user.photos && user.photos.length > 0 ? (
          <>
            <img
              src={user.photos[currentPhotoIndex]}
              alt={`${user.name}'s photo`}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Navigation */}
            {user.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  →
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {user.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" />
              <p>No photos available</p>
            </div>
          </div>
        )}

        {/* Super Like Badge */}
        {user.isSuperLiked && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Super Like!
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name}, {user.age}
            </h2>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{user.distance} km away</span>
            </div>
          </div>
          
          {user.isOnline && (
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 mb-4 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {user.interests.slice(0, 6).map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 6 && (
                <span className="text-gray-500 text-xs px-2 py-1">
                  +{user.interests.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDislike}
              disabled={isDisliked}
              className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                isDisliked 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <X className="w-6 h-6 text-red-500" />
            </button>

            <button
              onClick={handleSuperLike}
              disabled={isLiked}
              className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                isLiked 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <Star className="w-6 h-6 text-yellow-500" />
            </button>

            <button
              onClick={handleLike}
              disabled={isLiked}
              className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                isLiked 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <Heart className="w-6 h-6 text-pink-500" />
            </button>
          </div>
        )}

        {/* Message Button (for matches) */}
        {!showActions && onMessage && (
          <button
            onClick={() => onMessage(user.id)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Message</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;