import React from 'react';
import { MessageCircle, Heart, MapPin, Clock } from 'react-feather';

const MatchCard = ({ match, onMessage, onUnmatch }) => {
  const { user, matchedAt, lastMessage } = match;

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const formatLastMessage = (message) => {
    if (!message) return 'Start a conversation!';
    
    if (message.content.length > 50) {
      return message.content.substring(0, 50) + '...';
    }
    return message.content;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* User Avatar */}
          <div className="relative">
            <img
              src={user.photos?.[0] || '/default-avatar.png'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-200"
            />
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {user.name}, {user.age}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTimeAgo(matchedAt)}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{user.distance} km away</span>
            </div>

            {/* Last Message */}
            <div className="mb-3">
              <p className="text-sm text-gray-700">
                {formatLastMessage(lastMessage)}
              </p>
              {lastMessage && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {lastMessage.senderId === user.id ? user.name : 'You'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(lastMessage.createdAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => onMessage(match.id)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
              
              <button
                onClick={() => onUnmatch(match.id)}
                className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                title="Unmatch"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Common Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Common interests:</p>
            <div className="flex flex-wrap gap-1">
              {user.interests.slice(0, 4).map((interest, index) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 4 && (
                <span className="text-gray-500 text-xs px-2 py-1">
                  +{user.interests.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;