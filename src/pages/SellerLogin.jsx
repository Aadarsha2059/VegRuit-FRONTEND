import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/authAPI';
import AttractiveAuth from '../components/auth/AttractiveAuth';
import { FaUser, FaLock } from 'react-icons/fa';
import '../styles/SellerSignup.css';

const SellerLogin = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username or email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      // Attempt to login directly
      const response = await authAPI.loginSeller({
        username: formData.username.trim(),
        password: formData.password
      });
      
      if (response.success) {
        // Verify this is a seller account
        if (!response.user.isSeller) {
          toast.error('This account is not registered as a seller. Please use buyer login.');
          setLoading(false);
          return;
        }
        
        // Call onAuthSuccess if provided
        if (onAuthSuccess) {
          onAuthSuccess(response.user);
        }
        
        toast.success(`Welcome back, ${response.user.firstName}! 🌾`);
        
        // Store login state and user data in localStorage
        localStorage.setItem('sellerLoggedIn', 'true');
        localStorage.setItem('sellerData', JSON.stringify(response.user));
        
        // Clear any existing errors
        setErrors({});
        
        // Navigate to dashboard
        navigate('/seller-dashboard');
      } else {
        // Handle login failure
        toast.error(response.message || 'Invalid username or password');
        if (response.field) {
          setErrors({ [response.field]: response.message });
        } else {
          setErrors({ password: 'Invalid username or password' });
        }
      }
    } catch (error) {
      toast.error('Login failed. Please check your connection and try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AttractiveAuth title="Seller Login">
      <form onSubmit={handleLogin} className="seller-signup-form">
        <div className="form-group">
          <label htmlFor="username">Username or Email</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your username or email"
            />
          </div>
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon password-input">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="auth-footer">
          <p>
            Don't have a seller account? <Link to="/seller-signup">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </form>
    </AttractiveAuth>
  );
};

export default SellerLogin;