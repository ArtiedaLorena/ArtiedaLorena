import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Globe, AlertCircle } from 'react-feather';

const LocationPicker = ({ 
  onLocationChange, 
  initialLocation = null,
  showMap = true,
  allowManualInput = true,
  maxDistance = 50
}) => {
  const [location, setLocation] = useState(initialLocation || {
    latitude: null,
    longitude: null,
    address: '',
    city: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
    }
  }, [initialLocation]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Get address from coordinates using reverse geocoding
          const address = await reverseGeocode(latitude, longitude);
          
          const newLocation = {
            latitude,
            longitude,
            ...address
          };
          
          setLocation(newLocation);
          onLocationChange?.(newLocation);
          setError('');
        } catch (err) {
          setError('Failed to get address from coordinates');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      return {
        address: data.display_name || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        country: data.address?.country || ''
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        address: '',
        city: '',
        country: ''
      };
    }
  };

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Using OpenStreetMap Nominatim API for search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Location search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      searchLocation(query);
    }, 500);
  };

  const searchTimeout = React.useRef(null);

  const selectSearchResult = (result) => {
    const newLocation = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.display_name || '',
      city: result.address?.city || result.address?.town || result.address?.village || '',
      country: result.address?.country || ''
    };
    
    setLocation(newLocation);
    onLocationChange?.(newLocation);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleManualLocationChange = (field, value) => {
    const newLocation = { ...location, [field]: value };
    setLocation(newLocation);
    onLocationChange?.(newLocation);
  };

  const validateLocation = () => {
    if (!location.latitude || !location.longitude) {
      setError('Please select a valid location');
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Getting location...' : 'Use Current Location'}</span>
        </button>
        
        {location.latitude && location.longitude && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Location set</span>
          </div>
        )}
      </div>

      {/* Search Location */}
      {allowManualInput && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Search for a location
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Enter city, address, or landmark..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    {result.address?.city || result.address?.town || result.address?.village || 'Unknown City'}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Input Fields */}
      {allowManualInput && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={location.city || ''}
              onChange={(e) => handleManualLocationChange('city', e.target.value)}
              placeholder="Enter city name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={location.country || ''}
              onChange={(e) => handleManualLocationChange('country', e.target.value)}
              placeholder="Enter country name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Location Display */}
      {location.latitude && location.longitude && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Selected Location</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{location.address}</span>
            </div>
            <div className="text-xs text-gray-500">
              Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Map Preview (if enabled) */}
      {showMap && location.latitude && location.longitude && (
        <div className="bg-gray-200 rounded-lg p-4 text-center">
          <div className="w-full h-32 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              Map preview would be displayed here
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Interactive map component would be integrated here
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;