import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// ✅ GlobalProvider import ചെയ്യുക
import { GlobalProvider } from "./Context/GlobalContext";
// path ശരിയാക്കണം

const AppWrapper = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');

  const hideNavRoutes = ['/admin', '/register', '/log', '/photographer-dashboard', '/photografers', '/photographer/:id'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

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
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <GlobalProvider> {/* ✅ Context wrap */}
      <Router>
        <AppWrapper />
      </Router>
    </GlobalProvider>
  );
};

export default App;
