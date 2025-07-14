import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Camera, Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    bio: '',
    location: '',
    photoUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const userRoles = [
    { value: 'Photographer', label: 'Photographer', icon: <Camera className="w-4 h-4" /> },
    { value: 'Customer', label: 'Customer', icon: <User className="w-4 h-4" /> },
  
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select your role';
    if (formData.role === 'Photographer') {
      if (!formData.bio) newErrors.bio = 'Bio is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.photoUrl) newErrors.photoUrl = 'Photo URL is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'Photographer' && {
          bio: formData.bio,
          location: formData.location,
          photoUrl: formData.photoUrl
        })
      };

      const response = await fetch('https://localhost:7037/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });

     const result = await response.json();

if (!response.ok) throw new Error(result.message || 'Registration failed');

if (result.success) {
  localStorage.setItem('token', result.data.token);
  alert(result.message || '✅ Registration successful!');
  navigate('/log'); 
} else {
  alert(result.message || '❌ Registration failed.');
}

      setFormData({
        name: '', email: '', password: '', confirmPassword: '', role: '',
        bio: '', location: '', photoUrl: ''
      });

    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Join CaptureHub
          </h1>
          <p className="text-gray-300 text-lg">Welcome to the virtual world of creativity</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  placeholder="Enter your full name" />
              </div>
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  placeholder="Enter your email address" />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">I am joining as</label>
              <div className="grid grid-cols-1 gap-2">
                {userRoles.map((role) => (
                  <label key={role.value} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                    formData.role === role.value ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                  }`}>
                    <input type="radio" name="role" value={role.value} checked={formData.role === role.value} onChange={handleInputChange} className="sr-only" />
                    <div className="flex items-center gap-3">{role.icon}<span className="font-medium">{role.label}</span></div>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
            </div>

            {/* Photographer Extra Fields */}
            {formData.role === 'Photographer' && (
              <>
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Bio</label>
                  <input type="text" name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about yourself"
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50" />
                  {errors.bio && <p className="text-red-400 text-sm">{errors.bio}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Your current location"
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50" />
                  {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium uppercase tracking-wide">Photo URL</label>
                  <input type="file" accept='image/*' name="photoUrl" value={formData.photoUrl} onChange={handleInputChange} placeholder="Portfolio URL"
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50" />
                  {errors.photoUrl && <p className="text-red-400 text-sm">{errors.photoUrl}</p>}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-white/70">Already have an account? <button  onClick={() => navigate('/log')} className="text-blue-400 hover:text-blue-300 font-medium">Sign in here</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
