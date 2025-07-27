
// PhotographerDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Addservese from '../Photographer/Addservese';
import AvailableDates from '../Photographer/AvailableDates';
import UploadMedia from '../Photographer/UploadMedia';
import Booking from '../Photographer/Boking';
import { useUser, UserProvider } from '../Contexts/UserContext';

import CustomerChatReceiver from '../Photographer/CustomerChatReceiver';
import {
  Camera,
  Image,
  Calendar,
  Users,
  Settings,
  Upload,
  Search,
  Bell,
  LogOut,
  Import
} from 'lucide-react';



const PhotographerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();

  const navTabs = [
    { name: 'Home', icon: <Camera className="w-5 h-5" /> },
  
{ name: 'Upload Media', icon: <Upload className="w-5 h-5" /> },
    { name: 'Services', icon: <Upload className="w-5 h-5" /> },
    { name: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { name: 'CustomerChatReceiver', icon: <Users className="w-5 h-5" /> },
    { name: 'Reviews', icon: <Users className="w-5 h-5" /> },
   { name: 'Bio', icon: <Users className="w-5 h-5" /> },
   { name: 'Date', icon: <Import className="w-5 h-5" /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-blue-700 to-red-500 bg-clip-text text-transparent leading-tight">
                Welcome to the virtual
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-blue-600 to-blue-800 bg-clip-text text-transparent">
                world of creativity
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Capture moments, create memories, and showcase your artistic vision in this premium photography platform.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25">
                Start Creating
              </button>
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25">
                View Gallery
              </button>
            </div>
          </div>
        );

      case 'Events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-blue-500/25">
                New Event
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((event) => (
                <div key={event} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="h-40 bg-gradient-to-br from-blue-500 via-blue-700 to-red-500 rounded-lg mb-4 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Event {event}</h3>
                  <p className="text-gray-400 mb-4">Professional photography session</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Dec 15, 2024</span>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

    case 'Upload Media':
  return <UploadMedia/>;
        ;

   case 'Services':
  return <Addservese />;

      case 'Bookings':
        return <Booking/>
          

      case 'CustomerChatReceiver':
        return <CustomerChatReceiver

        />
       
        
        case 'Date':
  return <AvailableDates />;

      case 'Reviews':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            {[1, 2].map((rev) => (
              <div key={rev} className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="font-semibold">Customer {rev}</p>
                <p className="text-yellow-400">★★★★★</p>
                <p className="text-gray-400 mb-2">"Amazing photography!"</p>
                <input
                  type="text"
                  placeholder="Reply to review..."
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-6000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-blue-700 to-red-500 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PhotoStudio</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors flex items-center gap-1 text-red-400 hover:text-red-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>


          <div className="flex justify-center space-x-2 py-6">
            {navTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.name
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white backdrop-blur-md border border-gray-700 hover:border-blue-500/50'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-full">{renderContent()}</div>
        </div>
      </div>


      <div className="absolute bottom-0 left-0 right-0 bg-gray-800/30 backdrop-blur-md border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">© 2024 PhotoStudio. All rights reserved.</p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-blue-400 transition-colors">Privacy</button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors">Terms</button>
              <button className="text-gray-400 hover:text-red-400 transition-colors">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerDashboard;
