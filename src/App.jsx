import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import Home from './Home/Home';
import Nav from './Nave/Nave';
import RegisterForm from './Register/RegisterForm';
import PhotographerDashboard from './Home/PhotographerDashboard';
import LoginForm from './Register/LoginForm';
import AdminDashboard from './Home/AdminDashboard';
import Photographers from './Photographer/Photographers';
import Users from './Admin/Users';
import Addservese from './Photographer/Addservese';
import PhotographerProfile from './Photographer/PhotographerProfile';
import PhotographerBooking from './Photographer/PhotographerBooking';
import Customer from './Customer/Customer';
import { GlobalProvider } from "./Globel/GlobalContext";


import Chat from './Customer/Chat';
import CustomerChatReceiver from './Photographer/CustomerChatReceiver';

import { useUser, UserProvider } from './Contexts/UserContext';


const AppWrapper = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');

  const hideNavRoutes = ['/admin', '/register', '/log', '/photographer-dashboard', '/photografers', '/photographer/:id',"/book/:id","/Customer" ];
const shouldShowNav = !hideNavRoutes.some((route) =>
  matchPath(route, location.pathname)
);


  return (
    <>
      {shouldShowNav && <Nav activeTab={activeTab} setActiveTab={setActiveTab} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/log" element={<LoginForm />} />
        <Route path="/photographer-dashboard" element={<PhotographerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/photografers" element={<Photographers />} />
        <Route path="/users" element={<Users />} />
        <Route path="/servese" element={<Addservese />} />
        <Route path="/photographer/:id" element={<PhotographerProfile />} />
        <Route path="/book/:id" element={<PhotographerBooking />} />
         <Route path="/Customer" element={<Customer />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/CustomerChatReceiver" element={<CustomerChatReceiver />}/>
      
      </Routes>
    </>
  );
};

const App = () => {
  return (
     <GlobalProvider>
      <UserProvider> 
   
      <Router>
        <AppWrapper />
      </Router>

      </UserProvider> 
        </GlobalProvider>
  );
};

export default App;
