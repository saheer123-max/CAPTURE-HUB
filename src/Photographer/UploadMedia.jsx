import React, { useState } from 'react';
import {
  Upload, Image, Video, Loader2, Star, Sparkles, Camera, CloudUpload,
} from 'lucide-react';

const UploadMedia = () => {
  const [mediaType, setMediaType] = useState('photo');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]); // ✅ changed to array
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length || !title) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('mediaType', mediaType);

    files.forEach((file) => {
      formData.append('files', file); // ✅ send multiple files
    });

    try {
      setLoading(true);
      setMessage('');

      const token = localStorage.getItem('token');

      const response = await fetch('https://localhost:7037/api/Photographer/upload-media', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Uploaded successfully!');
        setTitle('');
        setDescription('');
        setFiles([]);
      } else {
        setMessage(result.message || '❌ Upload failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden text-white">
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-48 h-48 bg-pink-400 rounded-full blur-2xl opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-56 h-56 bg-purple-400 rounded-full blur-2xl opacity-15 animate-pulse"></div>

        <Sparkles className="absolute top-1/4 left-1/4 w-6 h-6 text-yellow-300 opacity-60 animate-bounce" />
        <Star className="absolute top-1/3 right-1/3 w-4 h-4 text-pink-300 opacity-60 animate-bounce delay-1000" />
        <Sparkles className="absolute bottom-1/4 left-1/3 w-5 h-5 text-blue-300 opacity-60 animate-bounce delay-2000" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-purple-600/30 w-full max-w-2xl p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 rounded-full flex items-center justify-center animate-bounce mb-3">
              <CloudUpload className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
              ✨ Upload Magical Media ✨
            </h2>
            <p className="text-gray-300 mt-1">Share your creative magic with the world!</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-md text-sm font-medium border flex items-center gap-2 transition-all duration-300 ${
                message.includes('successfully')
                  ? 'bg-green-700/20 text-green-300 border-green-500'
                  : 'bg-red-700/20 text-red-300 border-red-500'
              }`}
            >
              {message.includes('successfully') ? (
                <span className="text-green-400">✅</span>
              ) : (
                <span className="text-red-400">❌</span>
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Media type */}
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Media Type
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white backdrop-blur-md focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              >
                <option value="photo">📷 Photo</option>
                <option value="video">🎥 Video</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wedding shoot in Kochi"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-purple-400/20 focus:border-purple-400 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-400" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Add a short description..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-purple-400/20 focus:border-purple-400 transition resize-none"
              ></textarea>
            </div>

            {/* File input */}
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                Upload Files
              </label>
              <input
                type="file"
                multiple
                accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
                onChange={(e) => setFiles([...e.target.files])}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white file:bg-gradient-to-r file:from-yellow-400 file:to-pink-400 file:text-white file:rounded file:px-4 file:py-2 file:cursor-pointer hover:file:from-yellow-500 hover:file:to-pink-500"
              />
              {files.length > 0 && (
                <ul className="mt-2 text-sm text-gray-400 space-y-1">
                  {files.map((f, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {mediaType === 'photo' ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      {f.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 hover:from-yellow-500 hover:to-purple-500 shadow-purple-400/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Uploading Magic...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Your Magic
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-8 bg-purple-900/30 backdrop-blur-md rounded-xl p-6 border border-purple-600/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-yellow-300">
              <Sparkles className="w-5 h-5" />
              Magic Tips
            </h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex gap-2"><Star className="w-4 h-4 text-yellow-400" /> Use high-quality JPG, PNG images</li>
              <li className="flex gap-2"><Star className="w-4 h-4 text-yellow-400" /> Videos should be MP4, MOV, AVI format</li>
              <li className="flex gap-2"><Star className="w-4 h-4 text-yellow-400" /> Add a descriptive title to help SEO</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMedia;
