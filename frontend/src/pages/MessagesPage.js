import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, Filter, MoreVertical, Phone, Video, MapPin, Image as ImageIcon } from 'react-feather';
import LoadingSpinner from '../components/LoadingSpinner';

const MessagesPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock conversations data
        const mockConversations = [
          {
            id: 1,
            user: {
              id: 101,
              name: 'Sarah',
              photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'],
              isOnline: true,
              lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
            },
            lastMessage: {
              content: 'That sounds amazing! I love hiking too.',
              senderId: 101,
              createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
              isRead: false,
              type: 'TEXT'
            },
            unreadCount: 2,
            isPinned: true
          },
          {
            id: 2,
            user: {
              id: 102,
              name: 'Alex',
              photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'],
              isOnline: false,
              lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            },
            lastMessage: {
              content: 'What games do you play?',
              senderId: 'currentUser',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
              isRead: true,
              type: 'TEXT'
            },
            unreadCount: 0,
            isPinned: false
          },
          {
            id: 3,
            user: {
              id: 103,
              name: 'Emma',
              photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'],
              isOnline: true,
              lastSeen: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
            },
            lastMessage: {
              content: 'Sent you a photo',
              senderId: 103,
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
              isRead: false,
              type: 'IMAGE'
            },
            unreadCount: 1,
            isPinned: false
          },
          {
            id: 4,
            user: {
              id: 104,
              name: 'Michael',
              photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'],
              isOnline: false,
              lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
            },
            lastMessage: {
              content: 'Sent you a location',
              senderId: 104,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
              isRead: true,
              type: 'LOCATION'
            },
            unreadCount: 0,
            isPinned: false
          }
        ];
        
        setConversations(mockConversations);
        setFilteredConversations(mockConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, activeFilter, conversations]);

  const filterConversations = () => {
    let filtered = [...conversations];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(conversation =>
        conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(conversation => conversation.unreadCount > 0);
        break;
      case 'online':
        filtered = filtered.filter(conversation => conversation.user.isOnline);
        break;
      case 'pinned':
        filtered = filtered.filter(conversation => conversation.isPinned);
        break;
      case 'recent':
        filtered = filtered.filter(conversation => 
          Date.now() - new Date(conversation.lastMessage.createdAt) < 24 * 60 * 60 * 1000
        );
        break;
      default:
        break;
    }

    // Sort by last message time (most recent first)
    filtered.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    setFilteredConversations(filtered);
  };

  const handleConversationClick = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  const handlePinConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isPinned: !conv.isPinned }
        : conv
    ));
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would call your API here
      // await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'unread':
        return conversations.filter(conv => conv.unreadCount > 0).length;
      case 'online':
        return conversations.filter(conv => conv.user.isOnline).length;
      case 'pinned':
        return conversations.filter(conv => conv.isPinned).length;
      case 'recent':
        return conversations.filter(conv => 
          Date.now() - new Date(conv.lastMessage.createdAt) < 24 * 60 * 60 * 1000
        ).length;
      default:
        return conversations.length;
    }
  };

  const formatLastMessage = (message) => {
    if (!message) return '';
    
    switch (message.type) {
      case 'IMAGE':
        return '📷 Photo';
      case 'LOCATION':
        return '📍 Location';
      case 'AUDIO':
        return '🎵 Voice message';
      case 'FILE':
        return '📎 File';
      default:
        return message.content.length > 50 
          ? message.content.substring(0, 50) + '...'
          : message.content;
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
              Messages
            </h1>
            <p className="text-gray-600">
              {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/matches')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              View Matches
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            {['all', 'unread', 'online', 'pinned', 'recent'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {getFilterCount(filter)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || activeFilter !== 'all' ? 'No conversations found' : 'No conversations yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || activeFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start matching with people to begin conversations!'
            }
          </p>
          {!searchQuery && activeFilter === 'all' && (
            <button
              onClick={() => navigate('/discover')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Start Discovering
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`bg-white rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                conversation.isPinned ? 'border-blue-500 bg-blue-50' : 'border-transparent'
              } ${conversation.unreadCount > 0 ? 'ring-2 ring-blue-200' : ''}`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="flex items-center space-x-4">
                {/* User Avatar */}
                <div className="relative">
                  <img
                    src={conversation.user.photos[0]}
                    alt={conversation.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.user.name}
                      {conversation.isPinned && (
                        <span className="ml-2 text-blue-600">📌</span>
                      )}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      {/* Message Type Icon */}
                      {conversation.lastMessage.type === 'IMAGE' && (
                        <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      {conversation.lastMessage.type === 'LOCATION' && (
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      
                      {/* Message Content */}
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage.senderId === 'currentUser' ? 'You: ' : ''}
                        {formatLastMessage(conversation.lastMessage)}
                      </p>
                    </div>
                    
                    {/* Unread Count */}
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConversation(selectedConversation === conversation.id ? null : conversation.id);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {selectedConversation === conversation.id && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinConversation(conversation.id);
                          setSelectedConversation(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        {conversation.isPinned ? '📌 Unpin' : '📌 Pin'}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle call action
                          setSelectedConversation(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle video call action
                          setSelectedConversation(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Video className="w-4 h-4" />
                        <span>Video Call</span>
                      </button>
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                          setSelectedConversation(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {selectedConversation && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
};

export default MessagesPage;