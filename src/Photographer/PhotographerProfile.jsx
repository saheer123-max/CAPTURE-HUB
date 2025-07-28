import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useGlobalContext } from "../Context/GlobalContext"; 

import {
  User, TrendingUp, Award, Target, X, Camera, MapPin, Mail
} from 'lucide-react';

const backendUrl = import.meta.env.VITE_API_URL

const PhotographerProfile = () => {
 
  
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState([]);
  const [showMedia, setShowMedia] = useState(false);
 const navigate = useNavigate();
  // ✅ Media Fetch function (only on click)
  const fetchMedia = () => {
    const token = localStorage.getItem('token');
    axios.get(`https://localhost:7037/api/Photographer/${id}/media`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data.success) {
          setMedia(res.data.data);
          console.log("📸 Media fetched:", res.data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching media:', err.message);
      });
  };
const handleChatClick = () => {
  if (!profile?.id) {
    console.warn("🚫 profile.id is missing");
    return;
  }

  const target = {
    id: profile.userId,
    name: profile.name,
    photoUrl: profile.photoUrl,
    email: profile.email || '',
  };

  console.log("🎯 Target user to chat:", target);

  // ❌ Removed localStorage
  navigate("/chat", { state: { targetUser: target } }); // ✅ Only pass via route state
};





useEffect(() => {
  const token = localStorage.getItem('token');
  console.log("📦 token", token); // Check this


  axios.get(`https://localhost:7037/api/Photographer/by-user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.data.success) {
        console.log("📄 Profile from backend:", res.data.data);

        setProfile(res.data.data);
      } else {
        alert(res.data.message || 'Profile load ചെയ്യാൻ കഴിഞ്ഞില്ല');
      }
    })
    .catch((err) => {
      console.error('Error fetching profile:', err.message);
      alert('Photographer Profile ലോഡ് ചെയ്യാൻ പറ്റിയില്ല.');
    });

}, [id]);


  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile Loading</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
         
          <div className="flex items-center space-x-2">
          
         
          </div>
        </div>
      
      </div>

      <h1 className="text-4xl font-bold text-yellow-400 mb-8">Photographers</h1>

      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
          <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photographer Card */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-64 h-80 bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg shadow-xl relative overflow-hidden">
                <div className="absolute top-4 left-4 text-white">
              
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 border-4 border-white shadow-lg">
                    {profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white text-center">
                  <div className="text-lg font-bold">{profile.name}</div>
                  {profile.location && (
                    <div className="text-sm text-gray-200 mt-1">{profile.location}</div>
                  )}
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-gray-700" />
                </div>
              </div>
            </div>
            <div className="mt-6 text-center grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600 mb-2">Total Projects</div>
                <div className="text-2xl font-bold text-gray-800">0</div>
              </div>
              <div>
                <div className="text-gray-600 mb-2">Rating</div>
                <div className="text-2xl font-bold text-gray-800">⭐ 4.9</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div onClick={handleChatClick}>
                  <h3 className="text-lg font-semibold text-blue-600">Chat</h3>
                  <p className="text-gray-600">View detailed photographer information</p>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => {
                setShowMedia(true);
                fetchMedia();
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">Video & Photo</h3>
                  <p className="text-gray-600">Click to view uploaded media</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">Rating</h3>
                  <p className="text-gray-600">View awards and certifications</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/book/${profile.userId}`)} >
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">Booking</h3>
                  <p className="text-gray-600">Photography skills and expertise</p>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
              </div>
            )}

           
            {showMedia && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Photos & Videos</h3>
                {media.length === 0 ? (
                  <p className="text-gray-500">No media uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {media.map((item, index) => {
                      const mediaUrl = `${backendUrl}/${item.url.replace(/\\/g, '/')}`;
                          console.log("not seeing the medi",mediaUrl)
                      return (
                        <div key={index} className="rounded overflow-hidden shadow border border-gray-200">
                          {item.type === 'photo' ? (
                            <img
                              src={mediaUrl}
                              alt={`Photo ${index}`}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                              }}
                            />
                          ) : (
                            <video
                              controls
                              className="w-full h-48 object-cover bg-black"
                              onError={(e) => console.error(`❌ Video failed to load: ${mediaUrl}`)}
                            >
                              <source src={mediaUrl} type="video/mp4" />
                            Your browser does not support this video.

                            </video>
                          )}
                        </div>
                      );
                    })}

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <span className="text-lg">← Back</span>
        </button>
      </div>
    </div>
  );
};

export default PhotographerProfile;
