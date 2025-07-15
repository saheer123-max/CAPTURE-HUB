import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Photographers = () => {
  const [photographers, setPhotographers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('https://localhost:7037/api/Photographer', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setPhotographers(res.data.data);
        } else {
          alert(res.data.message || 'Failed to load photographers');
        }
      })
      .catch((err) => {
        console.error('Error fetching photographers:', err.response?.data || err.message);
        alert('Unable to fetch photographer data.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-yellow-400 mb-2 tracking-wide">
            Photographers
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photographers.length > 0 ? (
            photographers.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate(`/photographer/${user.id}`)} // ✅ Navigate on click
                className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer border border-gray-700"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-700">
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl mb-1">{user.name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  {user.location && (
                    <p className="text-gray-400 text-xs">📍 {user.location}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No photographers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Photographers;
