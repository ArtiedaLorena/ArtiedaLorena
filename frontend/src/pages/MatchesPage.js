import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Filter, Search, MapPin, Users } from 'react-feather';
import MatchCard from '../components/MatchCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MatchesPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock matches data
        const mockMatches = [
          {
            id: 1,
            user: {
              id: 101,
              name: 'Sarah',
              age: 25,
              photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'],
              distance: 2.5,
              isOnline: true,
              interests: ['Travel', 'Photography', 'Coffee', 'Hiking'],
              bio: 'Adventure seeker and coffee enthusiast ☕️'
            },
            matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            lastMessage: {
              content: 'That sounds amazing! I love hiking too.',
              senderId: 101,
              createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
            }
          },
          {
            id: 2,
            user: {
              id: 102,
              name: 'Alex',
              age: 28,
              photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'],
              distance: 5.2,
              isOnline: false,
              interests: ['Music', 'Gaming', 'Movies', 'Cooking'],
              bio: 'Gamer by night, chef by day 🎮👨‍🍳'
            },
            matchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            lastMessage: {
              content: 'What games do you play?',
              senderId: 'currentUser',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            }
          },
          {
            id: 3,
            user: {
              id: 103,
              name: 'Emma',
              age: 23,
              photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'],
              distance: 1.8,
              isOnline: true,
              interests: ['Art', 'Yoga', 'Reading', 'Nature'],
              bio: 'Creative soul finding beauty in everyday moments ✨'
            },
            matchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            lastMessage: null
          }
        ];
        
        setMatches(mockMatches);
        setFilteredMatches(mockMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    filterAndSortMatches();
  }, [searchQuery, activeFilter, sortBy, matches]);

  const filterAndSortMatches = () => {
    let filtered = [...matches];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(match =>
        match.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.user.interests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'online':
        filtered = filtered.filter(match => match.user.isOnline);
        break;
      case 'recent':
        filtered = filtered.filter(match => 
          Date.now() - new Date(match.matchedAt) < 7 * 24 * 60 * 60 * 1000
        );
        break;
      case 'nearby':
        filtered = filtered.filter(match => match.user.distance <= 5);
        break;
      case 'unread':
        filtered = filtered.filter(match => 
          match.lastMessage && 
          match.lastMessage.senderId !== 'currentUser' && 
          !match.lastMessage.isRead
        );
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.matchedAt) - new Date(a.matchedAt));
        break;
      case 'distance':
        filtered.sort((a, b) => a.user.distance - b.user.distance);
        break;
      case 'name':
        filtered.sort((a, b) => a.user.name.localeCompare(b.user.name));
        break;
      case 'lastMessage':
        filtered.sort((a, b) => {
          if (!a.lastMessage && !b.lastMessage) return 0;
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });
        break;
      default:
        break;
    }

    setFilteredMatches(filtered);
  };

  const handleMessage = (matchId) => {
    navigate(`/chat/${matchId}`);
  };

  const handleUnmatch = async (matchId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would call your API here
      // await fetch(`/api/matches/${matchId}`, { method: 'DELETE' });
      
      setMatches(prev => prev.filter(match => match.id !== matchId));
    } catch (error) {
      console.error('Error unmatching:', error);
    }
  };

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'online':
        return matches.filter(match => match.user.isOnline).length;
      case 'recent':
        return matches.filter(match => 
          Date.now() - new Date(match.matchedAt) < 7 * 24 * 60 * 60 * 1000
        ).length;
      case 'nearby':
        return matches.filter(match => match.user.distance <= 5).length;
      case 'unread':
        return matches.filter(match => 
          match.lastMessage && 
          match.lastMessage.senderId !== 'currentUser' && 
          !match.lastMessage.isRead
        ).length;
      default:
        return matches.length;
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="w-8 h-8 text-pink-500 mr-3" />
              Your Matches
            </h1>
            <p className="text-gray-600">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/discover')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Discover More
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
              placeholder="Search matches by name or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            {['all', 'online', 'recent', 'nearby', 'unread'].map((filter) => (
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

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="distance">Nearest First</option>
            <option value="name">Name A-Z</option>
            <option value="lastMessage">Last Message</option>
          </select>
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || activeFilter !== 'all' ? 'No matches found' : 'No matches yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || activeFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start discovering people to make your first match!'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onMessage={handleMessage}
              onUnmatch={handleUnmatch}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {matches.length > 0 && (
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{matches.length}</div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {matches.filter(match => match.user.isOnline).length}
              </div>
              <div className="text-sm text-gray-600">Online Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {matches.filter(match => match.lastMessage).length}
              </div>
              <div className="text-sm text-gray-600">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(matches.reduce((acc, match) => acc + match.user.distance, 0) / matches.length * 10) / 10}
              </div>
              <div className="text-sm text-gray-600">Avg. Distance (km)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;