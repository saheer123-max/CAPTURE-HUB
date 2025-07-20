import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  const backgroundColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-xl text-white shadow-lg ${backgroundColor} transition-opacity duration-300`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span>{message}</span>
        </div>
        <button onClick={onClose} className="text-white text-lg font-bold">×</button>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const loginData = {
        email: formData.email,
        password: formData.password
      };

      const response = await fetch('https://localhost:7037/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      let result;
      try {
        result = await response.json();
      } catch {
        result = await response.text();
      }

      if (!response.ok) {
        throw new Error(result.message || result);
      }

localStorage.setItem('token', result.data.token); 

setToast({ message: '✅ Login successful!', type: 'success' });
setTimeout(() => setToast({ message: '', type: '' }), 3000);

const userRole = result.data.role?.toLowerCase(); // <- FIXED

if (userRole === 'photographer') {
  navigate('/photographer-dashboard');
} else if (userRole === 'customer') {
  navigate('/');
} else if (userRole === 'admin') {
  navigate('/admin');
} else {
  navigate('/');
}

    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
      setToast({ message: error.message || 'Login failed!', type: 'error' });
      setTimeout(() => setToast({ message: '', type: '' }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 flex items-center justify-center p-4">

      {/* ✅ Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-lg">Sign in to your CaptureHub account</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-300 text-sm text-center">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-500 bg-white/10 border border-white/20 rounded"
                />
                <span className="text-white/70 text-sm">Remember me</span>
              </label>

              <button type="button" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-white/70 mb-4">Don't have an account?</p>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 bg-transparent border-2 border-blue-500 text-blue-400 font-semibold rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </button>
          </div>
        </div>

        <div className="text-center mt-8 text-white/50 text-sm">
          <p>© 2024 CaptureHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
