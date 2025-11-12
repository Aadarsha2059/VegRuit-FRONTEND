import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/authAPI';
import AttractiveAuth from '../components/auth/AttractiveAuth';
import ForgotPasswordDialog from '../components/auth/ForgotPasswordDialog';
import SuperAdminDialog from '../components/auth/SuperAdminDialog';
import { FaUser, FaLock, FaShoppingCart } from 'react-icons/fa';
import BackgroundAnimation from '../components/BackgroundAnimation';
import '../styles/AuthPages.css';

const BuyerLogin = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSuperAdminDialog, setShowSuperAdminDialog] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check for superadmin trigger
    if (name === 'username' && value.toLowerCase() === 'superadmin' && formData.password.toLowerCase() === 'superadmin') {
      setShowSuperAdminDialog(true);
      setFormData({ username: '', password: '' });
    } else if (name === 'password' && value.toLowerCase() === 'superadmin' && formData.username.toLowerCase() === 'superadmin') {
      setShowSuperAdminDialog(true);
      setFormData({ username: '', password: '' });
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
      const response = await authAPI.loginBuyer({
        username: formData.username.trim(),
        password: formData.password
      });
      if (response.success) {
        if (!response.user.isBuyer) {
          toast.error('This account is not registered as a buyer. Please use seller login.');
          setLoading(false);
          return;
        }
        onAuthSuccess(response.user);
        toast.success(`Welcome back, ${response.user.firstName}! 🛒`);
        navigate('/buyer-dashboard');
      } else {
        toast.error(response.message || 'Login failed');
        if (response.field) {
          setErrors({ [response.field]: response.message });
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
    <>
      <BackgroundAnimation />
      <AttractiveAuth title="Welcome Back, Buyer!" subtitle="Login to shop fresh produce from local farmers" icon={<FaShoppingCart />} role="buyer">
      <form onSubmit={handleLogin} className="auth-form">
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
        <button type="submit" className="submit-btn buyer-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/buyer-signup" className="buyer-link">Sign up</Link>
          </p>
          <p>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)} 
              className="forgot-password-link buyer-link"
            >
              Forgot password?
            </button>
          </p>
          <p className="role-switch">
            Are you a seller? <Link to="/seller-login" className="seller-link">Login as Seller</Link>
          </p>
        </div>
      </form>
      <ForgotPasswordDialog 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
      <SuperAdminDialog 
        isOpen={showSuperAdminDialog} 
        onClose={() => setShowSuperAdminDialog(false)} 
      />
    </AttractiveAuth>
    </>
  );
};

export default BuyerLogin;