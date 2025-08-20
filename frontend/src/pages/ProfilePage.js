import React, { useState, useEffect } from 'react';
import { Edit2, Camera, MapPin, Calendar, Mail, Phone, Globe, Save, X } from 'react-feather';
import PhotoUpload from '../components/PhotoUpload';
import LocationPicker from '../components/LocationPicker';
import InterestSelector from '../components/InterestSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock profile data
        const mockProfile = {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          birthDate: '1995-03-15',
          age: 28,
          gender: 'Male',
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: 'New York, NY, USA',
            city: 'New York',
            country: 'USA'
          },
          photos: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
          ],
          bio: 'Adventure seeker, coffee enthusiast, and tech lover. Always looking for new experiences and meaningful connections.',
          interests: ['Travel', 'Technology', 'Coffee', 'Hiking', 'Photography', 'Music'],
          preferences: {
            ageRange: { min: 23, max: 35 },
            maxDistance: 25,
            showOnlineStatus: true,
            allowLocationSharing: true,
            notifications: {
              newMatches: true,
              messages: true,
              likes: true,
              superLikes: true
            }
          },
          stats: {
            profileViews: 156,
            likesReceived: 89,
            matches: 23,
            conversations: 18
          }
        };
        
        setProfile(mockProfile);
        setEditedProfile(mockProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API here
      // await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedProfile)
      // });
      
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (location) => {
    setEditedProfile(prev => ({
      ...prev,
      location
    }));
  };

  const handleInterestsChange = (interests) => {
    setEditedProfile(prev => ({
      ...prev,
      interests
    }));
  };

  const handlePhotosChange = (photos) => {
    setEditedProfile(prev => ({
      ...prev,
      photos: photos.map(photo => photo.previewUrl || photo)
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [field]: value
        }
      }
    }));
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h3>
        <p className="text-gray-600">Unable to load your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your profile and preferences</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{profile.stats.profileViews}</div>
            <div className="text-sm text-blue-800">Profile Views</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{profile.stats.likesReceived}</div>
            <div className="text-sm text-green-800">Likes Received</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{profile.stats.matches}</div>
            <div className="text-sm text-purple-800">Matches</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{profile.stats.conversations}</div>
            <div className="text-sm text-orange-800">Conversations</div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photos and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos Tab */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <Camera className="w-4 h-4 inline mr-1" />
                  Add Photos
                </button>
              )}
            </div>
            
            {isEditing ? (
              <PhotoUpload
                photos={editedProfile.photos.map(url => ({ previewUrl: url }))}
                onPhotosChange={handlePhotosChange}
                maxPhotos={6}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProfile.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.age} years old</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    value={editedProfile.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.gender}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
            
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell people about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interests</h2>
            
            {isEditing ? (
              <InterestSelector
                selectedInterests={editedProfile.interests}
                onInterestsChange={handleInterestsChange}
                maxInterests={10}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            
            {isEditing ? (
              <LocationPicker
                initialLocation={editedProfile.location}
                onLocationChange={handleLocationChange}
                showMap={false}
              />
            ) : (
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{profile.location.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preferences and Settings */}
        <div className="space-y-6">
          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editedProfile.preferences.ageRange.min}
                      onChange={(e) => handlePreferenceChange('ageRange', 'min', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      min="18"
                      max="100"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={editedProfile.preferences.ageRange.max}
                      onChange={(e) => handlePreferenceChange('ageRange', 'max', parseInt(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      min="18"
                      max="100"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {profile.preferences.ageRange.min} - {profile.preferences.ageRange.max} years
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Distance</label>
                {isEditing ? (
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editedProfile.preferences.maxDistance}
                    onChange={(e) => handlePreferenceChange('maxDistance', null, parseInt(e.target.value))}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-900">{profile.preferences.maxDistance} km</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedProfile.preferences.showOnlineStatus}
                    onChange={(e) => handlePreferenceChange('showOnlineStatus', null, e.target.checked)}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show online status</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedProfile.preferences.allowLocationSharing}
                    onChange={(e) => handlePreferenceChange('allowLocationSharing', null, e.target.checked)}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Allow location sharing</span>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
            
            <div className="space-y-2">
              {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedProfile.preferences.notifications[key]}
                    onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
            
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Privacy Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;