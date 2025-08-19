import React from 'react';
import { Check, CheckCheck, Clock, MapPin, Image as ImageIcon } from 'react-feather';

const MessageCard = ({ message, isOwn, showAvatar = true, showTime = true }) => {
  const { content, messageType, createdAt, isRead, location, imageUrl } = message;

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return messageDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderMessageContent = () => {
    switch (messageType) {
      case 'TEXT':
        return (
          <p className="text-gray-800 leading-relaxed break-words">
            {content}
          </p>
        );
      
      case 'IMAGE':
        return (
          <div className="space-y-2">
            <img
              src={imageUrl}
              alt="Shared image"
              className="max-w-xs rounded-lg shadow-sm"
            />
            {content && (
              <p className="text-gray-800 leading-relaxed break-words">
                {content}
              </p>
            )}
          </div>
        );
      
      case 'LOCATION':
        return (
          <div className="space-y-2">
            <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="font-medium">Location shared</span>
              </div>
              {content && (
                <p className="text-sm text-gray-600 mt-1">
                  {content}
                </p>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <p className="text-gray-800 leading-relaxed break-words">
            {content}
          </p>
        );
    }
  };

  const renderReadStatus = () => {
    if (!isOwn) return null;
    
    if (isRead) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    } else {
      return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0">
            <img
              src={message.senderAvatar || '/default-avatar.png'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          } shadow-sm`}
        >
          {renderMessageContent()}
          
          {/* Message Footer */}
          <div className={`flex items-center justify-between mt-2 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          } text-xs`}>
            <div className="flex items-center space-x-1">
              {showTime && (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(createdAt)}</span>
                </>
              )}
            </div>
            
            {isOwn && (
              <div className="flex items-center space-x-1">
                {renderReadStatus()}
              </div>
            )}
          </div>
        </div>

        {/* Avatar for own messages */}
        {showAvatar && isOwn && (
          <div className="flex-shrink-0">
            <img
              src={message.senderAvatar || '/default-avatar.png'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;