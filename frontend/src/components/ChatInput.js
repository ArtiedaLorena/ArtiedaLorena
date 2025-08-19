import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, MapPin, Smile, Paperclip, Mic, MicOff } from 'react-feather';

const ChatInput = ({ 
  onSendMessage, 
  onTyping, 
  isTyping = false,
  disabled = false,
  placeholder = "Type a message...",
  maxLength = 1000,
  showAttachments = true,
  showEmoji = true,
  showVoice = false
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle typing indicator
  useEffect(() => {
    if (onTyping) {
      const timeout = setTimeout(() => {
        onTyping(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [message, onTyping]);

  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      if (onTyping && value.length > 0) {
        onTyping(true);
      }
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage({
        type: 'TEXT',
        content: trimmedMessage,
        timestamp: new Date()
      });
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onSendMessage({
            type: 'IMAGE',
            content: '',
            imageUrl: event.target.result,
            fileName: file.name,
            fileSize: file.size,
            timestamp: new Date()
          });
        };
        reader.readAsDataURL(file);
      } else {
        // Handle other file types
        onSendMessage({
          type: 'FILE',
          content: file.name,
          fileName: file.name,
          fileSize: file.size,
          timestamp: new Date()
        });
      }
    });
    
    // Reset input
    e.target.value = '';
    setIsAttachmentMenuOpen(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onSendMessage({
            type: 'IMAGE',
            content: '',
            imageUrl: event.target.result,
            fileName: file.name,
            fileSize: file.size,
            timestamp: new Date()
          });
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    e.target.value = '';
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSendMessage({
            type: 'LOCATION',
            content: 'Location shared',
            latitude,
            longitude,
            timestamp: new Date()
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
    setIsAttachmentMenuOpen(false);
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      // Start recording logic would go here
      setIsRecording(true);
      // In a real app, you'd use the Web Audio API or MediaRecorder
    } else {
      // Stop recording logic would go here
      setIsRecording(false);
      // Send the recorded audio
      onSendMessage({
        type: 'AUDIO',
        content: 'Voice message',
        timestamp: new Date()
      });
    }
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const toggleAttachmentMenu = () => {
    setIsAttachmentMenuOpen(!isAttachmentMenuOpen);
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  // Common emojis
  const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '😍', '🤔', '👋', '💪'];

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <span>Someone is typing...</span>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        {showAttachments && (
          <div className="relative">
            <button
              type="button"
              onClick={toggleAttachmentMenu}
              disabled={disabled}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Attachments"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Attachment Menu */}
            {isAttachmentMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-48">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                  >
                    <Image className="w-4 h-4" />
                    <span>Photo</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>File</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleLocationShare}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voice Record Button */}
        {showVoice && (
          <button
            type="button"
            onClick={handleVoiceRecord}
            disabled={disabled}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={isRecording ? 'Stop recording' : 'Voice message'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {/* Character Count */}
          {message.length > maxLength * 0.8 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {message.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Emoji Button */}
        {showEmoji && (
          <div className="relative">
            <button
              type="button"
              onClick={toggleEmojiPicker}
              disabled={disabled}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Emoji Picker */}
            {isEmojiPickerOpen && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <div className="grid grid-cols-5 gap-2">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="w-8 h-8 text-xl hover:bg-gray-100 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="*/*"
      />
      
      <input
        ref={imageInputRef}
        type="file"
        multiple
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />

      {/* Click outside to close menus */}
      {(isEmojiPickerOpen || isAttachmentMenuOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsEmojiPickerOpen(false);
            setIsAttachmentMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatInput;