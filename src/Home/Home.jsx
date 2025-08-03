import React, { useEffect, useState } from 'react';
import { User, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EventsDashboard from './EventsDashboard';
import PhotographerCarousel from './PhotographerCarousel';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

 const handleLogout = () => {
  localStorage.clear();  // 🔥 Clear everything
  setIsLoggedIn(false);
  navigate('/');
};

  const sidebarActions = [
    isLoggedIn
      ? {
          icon: LogOut,
          text: 'Logout',
          action: handleLogout,
          color: 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:brightness-110',
        }
      : {
          icon: User,
          text: 'Login',
          route: '/log',
          color: 'bg-gradient-to-r from-[#007bfd] via-[#0298f8] to-[#00b8f4] hover:brightness-110',
        },
    {
      icon: HelpCircle,
      text: 'About us',
      color: 'bg-gradient-to-r from-[#007bfd] via-[#0298f8] to-[#00b8f4] hover:brightness-110',
    },
  ];

  return (
    <div>
    
      <div id="Home" className="relative w-full h-150 bg-black overflow-hidden scroll-section">
        <style>{`
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-gradient {
            background: linear-gradient(-45deg, #0ea5e9, #3b82f6, #8b5cf6, #ec4899, #06b6d4, #10b981, #6366f1);
            background-size: 400% 400%;
            animation: gradient-shift 4s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>


        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 space-y-2">
          {sidebarActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  if (action.route) navigate(action.route);
                  if (action.action) action.action();
                }}
                className={`${action.color} text-white px-4 py-3 rounded-l-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-x-1 flex items-center space-x-3 min-w-[250px] text-left`}
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-white" />
                <span className="font-medium text-sm">{action.text}</span>
              </button>
            );
          })}
        </div>


        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-white text-center">
            <h1 className="text-4xl md:text-6xl font-bold animated-gradient">
              Welcome to the virtual <br /> world of creativity
            </h1>
          </div>
        </div>
      </div>


      <div id="Photographers" className="scroll-section">
        <PhotographerCarousel />
      </div>


      <div id="Events" className="scroll-section">
        <EventsDashboard />
      </div>


      <div id="About us" className="p-10 scroll-section text-white">
        <h2 className="text-3xl font-bold mb-4">messege</h2>
        <p>We connect photographers and clients through a creative virtual platform.</p>
      </div>

      {/* Daily Game Section */}
      <div id="Daily Game" className="p-10 scroll-section text-white">
        <h2 className="text-3xl font-bold mb-4">Daily Game</h2>
        <p>Complete tasks, earn rewards, and level up daily!</p>
      </div>
    </div>
  );
};

export default Home;
