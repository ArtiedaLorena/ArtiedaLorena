import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Image as ImageIcon } from 'react-feather';

const PhotoUpload = ({ 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 6, 
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    const newPhotos = [];
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          throw new Error(`File type ${file.type} is not supported`);
        }

        // Validate file size
        if (file.size > maxFileSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`);
        }

        // Check if we have room for more photos
        if (photos.length + newPhotos.length >= maxPhotos) {
          break;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        newPhotos.push({
          id: Date.now() + i,
          file,
          previewUrl,
          isUploading: true
        });
      }

      // Update photos
      const updatedPhotos = [...photos, ...newPhotos];
      onPhotosChange(updatedPhotos);

      // Simulate upload process (replace with actual upload logic)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark as uploaded
      const finalPhotos = updatedPhotos.map(photo => ({
        ...photo,
        isUploading: false
      }));
      onPhotosChange(finalPhotos);

    } catch (error) {
      console.error('Error uploading photos:', error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
  };

  const reorderPhotos = (fromIndex, toIndex) => {
    const updatedPhotos = [...photos];
    const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
    updatedPhotos.splice(toIndex, 0, movedPhoto);
    onPhotosChange(updatedPhotos);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop photos here, or{' '}
                <button
                  type="button"
                  onClick={openFileSelector}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={uploading}
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG, WebP up to 5MB • Max {maxPhotos} photos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={photo.previewUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Upload Progress Overlay */}
              {photo.isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
              )}
              
              {/* Photo Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => reorderPhotos(index, index - 1)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  
                  {index < photos.length - 1 && (
                    <button
                      type="button"
                      onClick={() => reorderPhotos(index, index + 1)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
              
              {/* Photo Number Badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Limit Warning */}
      {photos.length >= maxPhotos && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              You've reached the maximum number of photos ({maxPhotos}). 
              Remove some photos to add new ones.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;