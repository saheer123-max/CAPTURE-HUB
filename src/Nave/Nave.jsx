import React from 'react';
import { Camera, Calendar, Image, Users, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Nav = ({ activeTab, setActiveTab, gems }) => {
  const navigate = useNavigate();
  const tabs = [
    {
      name: 'Home',
      hasNotification: false,
      icon: Camera,
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-cyan-400 to-cyan-600'
    },
    {
      name: 'Photographers',
      hasNotification: false,
      icon: Calendar,
      color: 'from-lime-400 to-lime-600',
      bgColor: 'bg-gradient-to-br from-lime-400 to-lime-600'
    },
    {
      name: 'Events',
      hasNotification: false,
      icon: Image,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600'
    },
    {
      name: 'meseage',
      hasNotification: false,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      name: 'stat',
      hasNotification: true,
      icon: Download,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
  ];
const handleTabClick = (name) => {
  setActiveTab(name);

  if (name === 'stat') {
    // 👇 replace 123 with dynamic bookingId if needed
    navigate('/customer-status'); // OR `/customer/${bookingId}`
    return;
  }

  const section = document.getElementById(name);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};


  return (
    <>
 
      <div className="hidden lg:block fixed top-0 z-50 w-full p-4">
        <div className="flex justify-center mx-auto">
          <nav className="flex rounded-full bg-[#1e1e1e] w-fit items-center justify-center gap-4 px-6 py-3">
            {tabs.slice(0, 5).map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
                className={`relative px-6 rounded-full py-3 font-medium transition-all duration-300 transform hover:scale-105
                  ${activeTab === tab.name
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'bg-white/10 text-white hover:bg-white/20'}
                `}
              >
                {tab.name}
                {tab.hasNotification && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>


      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="flex justify-center">
          <nav className="flex items-center gap-3 bg-gray-900/95 backdrop-blur-md rounded-2xl px-6 py-4 border border-gray-700">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`relative flex flex-col items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.name ? 'scale-110' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${tab.bgColor} flex items-center justify-center shadow-lg ${
                    activeTab === tab.name ? 'shadow-xl' : ''
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    activeTab === tab.name ? 'text-white' : 'text-gray-400'
                  }`}>
                    {tab.name}
                  </span>
                  {tab.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">1</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>


      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">PhotoStudio</h1>
          </div>
          {gems && (
            <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-500 font-medium text-sm">{gems}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Nav;
