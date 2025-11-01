import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/authAPI';
import AttractiveAuth from '../components/auth/AttractiveAuth';

const BuyerLogin = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
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

  return (
    <AttractiveAuth title="Buyer Login">
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username or Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/buyer-signup">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </form>
    </AttractiveAuth>
  );
};

export default BuyerLogin;