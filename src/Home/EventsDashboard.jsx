import React, { useState } from 'react';
import { Calendar, Camera, Heart, Video, Users, Gift, Music } from 'lucide-react';

const EventsDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: "Birthday Party",
      category: "Celebration",
      icon: <Gift className="w-8 h-8" />,
      bgGradient: "from-pink-500 via-purple-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=250&fit=crop",
      description: "Memorable birthday celebrations"
    },
    {
      id: 2,
      title: "Marriage Ceremony",
      category: "Wedding",
      icon: <Heart className="w-8 h-8" />,
      bgGradient: "from-rose-400 via-pink-500 to-red-500",
      image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=400&h=250&fit=crop",
      description: "Beautiful wedding moments"
    },
    {
      id: 3,
      title: "Reels Creation",
      category: "Content",
      icon: <Video className="w-8 h-8" />,
      bgGradient: "from-blue-500 via-cyan-500 to-teal-500",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
      description: "Viral social media content"
    },
    {
      id: 4,
      title: "Photoshoot",
      category: "Photography",
      icon: <Camera className="w-8 h-8" />,
      bgGradient: "from-amber-500 via-orange-500 to-red-500",
      image: "https://images.unsplash.com/photo-1554048612-b6a482b224d1?w=400&h=250&fit=crop",
      description: "Professional photography sessions"
    },
    {
      id: 5,
      title: "Corporate Events",
      category: "Business",
      icon: <Users className="w-8 h-8" />,
      bgGradient: "from-slate-600 via-gray-700 to-zinc-800",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop",
      description: "Professional business gatherings"
    },
    {
      id: 6,
      title: "Music Concert",
      category: "Entertainment",
      icon: <Music className="w-8 h-8" />,
      bgGradient: "from-violet-500 via-purple-600 to-indigo-700",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      description: "Live music performances"
    },
  ];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Events</h1>
          <p className="text-blue-200">Choose your perfect event experience</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="relative"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${event.bgGradient} opacity-80`}></div>
                </div>
                <div className="relative z-10 p-6 h-64 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-black bg-opacity-30 rounded-full text-white text-sm font-medium">
                      {event.category}
                    </span>
                    <div className="text-white opacity-80">
                      {event.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-white text-opacity-90 text-sm">{event.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
            <Calendar className="w-5 h-5 inline mr-2" />
            Schedule Event
          </button>
          <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold">
            View All Events
          </button>
        </div>
      </div>


      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${selectedEvent.bgGradient} text-white mr-4`}>
                {selectedEvent.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.title}</h2>
                <p className="text-gray-600">{selectedEvent.category}</p>
              </div>
            </div>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 mb-6">{selectedEvent.description}</p>
            <div className="flex space-x-4">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold">
                Book Now
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsDashboard;
