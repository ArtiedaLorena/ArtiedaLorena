import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, MapPin, Image as ImageIcon, User } from 'react-feather';
import MessageCard from '../components/MessageCard';
import ChatInput from '../components/ChatInput';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock conversation data
        const mockConversation = {
          id: conversationId,
          user: {
            id: 101,
            name: 'Sarah',
            age: 25,
            photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'],
            isOnline: true,
            lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            interests: ['Travel', 'Photography', 'Coffee', 'Hiking'],
            bio: 'Adventure seeker and coffee enthusiast ☕️',
            distance: 2.5
          }
        };
        
        setConversation(mockConversation);
        
        // Mock messages data
        const mockMessages = [
          {
            id: 1,
            content: 'Hey! How are you doing?',
            senderId: 101,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            isRead: true,
            type: 'TEXT',
            senderAvatar: mockConversation.user.photos[0]
          },
          {
            id: 2,
            content: 'Hi Sarah! I\'m doing great, thanks for asking. How about you?',
            senderId: 'currentUser',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            isRead: true,
            type: 'TEXT',
            senderAvatar: '/default-avatar.png'
          },
          {
            id: 3,
            content: 'I\'m good too! Just got back from a hiking trip. It was amazing!',
            senderId: 101,
            createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
            isRead: true,
            type: 'TEXT',
            senderAvatar: mockConversation.user.photos[0]
          },
          {
            id: 4,
            content: 'That sounds amazing! I love hiking too.',
            senderId: 'currentUser',
            createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
            isRead: true,
            type: 'TEXT',
            senderAvatar: '/default-avatar.png'
          },
          {
            id: 5,
            content: 'Here\'s a photo from the trip!',
            senderId: 101,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            isRead: false,
            type: 'IMAGE',
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            senderAvatar: mockConversation.user.photos[0]
          },
          {
            id: 6,
            content: 'Wow, that looks incredible! Where was this?',
            senderId: 'currentUser',
            createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
            isRead: false,
            type: 'TEXT',
            senderAvatar: '/default-avatar.png'
          },
          {
            id: 7,
            content: 'It was in the Rocky Mountains! Here\'s the exact location.',
            senderId: 101,
            createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            isRead: false,
            type: 'LOCATION',
            latitude: 40.3772,
            longitude: -105.5217,
            senderAvatar: mockConversation.user.photos[0]
          }
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (messageData) => {
    const newMessage = {
      id: Date.now(),
      ...messageData,
      senderId: 'currentUser',
      createdAt: new Date(),
      isRead: false,
      senderAvatar: '/default-avatar.png'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Simulate response (in a real app, this would come from WebSocket)
      if (messageData.type === 'TEXT') {
        const responseMessage = {
          id: Date.now() + 1,
          content: 'Thanks for the message! I\'ll get back to you soon.',
          senderId: conversation.user.id,
          createdAt: new Date(),
          isRead: false,
          type: 'TEXT',
          senderAvatar: conversation.user.photos[0]
        };
        setMessages(prev => [...prev, responseMessage]);
      }
    }, 2000);
  };

  const handleTyping = (typing) => {
    setIsTyping(typing);
  };

  const formatLastSeen = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Conversation not found</h3>
        <p className="text-gray-600 mb-6">The conversation you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/messages')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Messages
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/messages')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={conversation.user.photos[0]}
                  alt={conversation.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {conversation.user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div>
                <h2 className="font-semibold text-gray-900">
                  {conversation.user.name}, {conversation.user.age}
                </h2>
                <p className="text-sm text-gray-500">
                  {conversation.user.isOnline 
                    ? 'Online' 
                    : `Last seen ${formatLastSeen(conversation.user.lastSeen)}`
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-10">
                  <button
                    onClick={() => {
                      setShowUserInfo(!showUserInfo);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Handle block user
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    🚫 Block User
                  </button>
                  
                  <button
                    onClick={() => {
                      // Handle report user
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    ⚠️ Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Info Sidebar */}
      {showUserInfo && (
        <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-20 overflow-y-auto">
          <div className="p-6">
            <div className="text-right mb-4">
              <button
                onClick={() => setShowUserInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img
                src={conversation.user.photos[0]}
                alt={conversation.user.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {conversation.user.name}, {conversation.user.age}
              </h3>
              <p className="text-gray-600 mb-2">
                {conversation.user.distance} km away
              </p>
              <div className="flex items-center justify-center space-x-1">
                <div className={`w-3 h-3 rounded-full ${
                  conversation.user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-500">
                  {conversation.user.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">About</h4>
                <p className="text-gray-600 text-sm">{conversation.user.bio}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {conversation.user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            isOwn={message.senderId === 'currentUser'}
            showAvatar={true}
            showTime={true}
          />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-2">
            <img
              src={conversation.user.photos[0]}
              alt={conversation.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        isTyping={isTyping}
        placeholder="Type a message..."
        showAttachments={true}
        showEmoji={true}
        showVoice={false}
      />

      {/* Click outside to close menus */}
      {(showMenu || showUserInfo) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowMenu(false);
            setShowUserInfo(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;