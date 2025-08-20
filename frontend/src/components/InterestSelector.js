import React, { useState, useEffect } from 'react';
import { Tag, Plus, X, Search } from 'react-feather';

const InterestSelector = ({ 
  selectedInterests = [], 
  onInterestsChange, 
  maxInterests = 10,
  availableInterests = [],
  allowCustom = true,
  showSearch = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [filteredInterests, setFilteredInterests] = useState(availableInterests);

  // Default interests if none provided
  const defaultInterests = [
    'Travel', 'Music', 'Sports', 'Reading', 'Cooking', 'Gaming',
    'Photography', 'Art', 'Technology', 'Fitness', 'Dancing', 'Hiking',
    'Movies', 'Fashion', 'Food', 'Pets', 'Nature', 'Science',
    'History', 'Languages', 'Volunteering', 'Yoga', 'Meditation',
    'Cycling', 'Swimming', 'Running', 'Painting', 'Writing', 'Singing'
  ];

  const interests = availableInterests.length > 0 ? availableInterests : defaultInterests;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInterests(interests);
    } else {
      const filtered = interests.filter(interest =>
        interest.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedInterests.includes(interest)
      );
      setFilteredInterests(filtered);
    }
  }, [searchQuery, interests, selectedInterests]);

  const addInterest = (interest) => {
    if (selectedInterests.length >= maxInterests) {
      alert(`You can only select up to ${maxInterests} interests`);
      return;
    }
    
    if (!selectedInterests.includes(interest)) {
      const newInterests = [...selectedInterests, interest];
      onInterestsChange(newInterests);
      setSearchQuery('');
    }
  };

  const removeInterest = (interestToRemove) => {
    const newInterests = selectedInterests.filter(interest => interest !== interestToRemove);
    onInterestsChange(newInterests);
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      addInterest(trimmed);
      setCustomInterest('');
    }
  };

  const handleCustomInterestKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomInterest();
    }
  };

  const getInterestColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-teal-100 text-teal-800',
      'bg-orange-100 text-orange-800',
      'bg-gray-100 text-gray-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      {/* Selected Interests Display */}
      {selectedInterests.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Interests ({selectedInterests.length}/{maxInterests})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest, index) => (
              <div
                key={interest}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getInterestColor(index)}`}
              >
                <Tag className="w-3 h-3" />
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interest Limit Warning */}
      {selectedInterests.length >= maxInterests && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-yellow-800">
            <Tag className="w-4 h-4" />
            <span className="text-sm">
              You've reached the maximum number of interests ({maxInterests}). 
              Remove some interests to add new ones.
            </span>
          </div>
        </div>
      )}

      {/* Search and Add Interests */}
      {selectedInterests.length < maxInterests && (
        <div className="space-y-3">
          {/* Search Bar */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search interests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Available Interests Grid */}
          {filteredInterests.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Interests
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredInterests.slice(0, 20).map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => addInterest(interest)}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="w-3 h-3" />
                      <span className="truncate">{interest}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredInterests.length > 20 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Showing first 20 results. Use search to find more.
                </p>
              )}
            </div>
          )}

          {/* Custom Interest Input */}
          {allowCustom && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyPress={handleCustomInterestKeyPress}
                placeholder="Add custom interest..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={30}
              />
              <button
                type="button"
                onClick={addCustomInterest}
                disabled={!customInterest.trim() || selectedInterests.length >= maxInterests}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          )}

          {/* No Results Message */}
          {searchQuery && filteredInterests.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No interests found matching "{searchQuery}"</p>
              {allowCustom && (
                <p className="text-sm mt-1">
                  Try adding it as a custom interest above
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Popular Interests Suggestion */}
      {selectedInterests.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Popular Interests</h4>
          <div className="flex flex-wrap gap-2">
            {['Travel', 'Music', 'Sports', 'Reading', 'Cooking'].map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => addInterest(interest)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestSelector;