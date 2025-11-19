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
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  // Check for existing lockout on component mount
  React.useEffect(() => {
    const storedLockout = localStorage.getItem('buyerLoginLockout');
    if (storedLockout) {
      const lockoutData = JSON.parse(storedLockout);
      const now = Date.now();
      if (now < lockoutData.until) {
        setLockoutTime(lockoutData.until);
        setLoginAttempts(lockoutData.attempts);
      } else {
        localStorage.removeItem('buyerLoginLockout');
      }
    }
    
    const storedAttempts = localStorage.getItem('buyerLoginAttempts');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
  }, []);

  // Update remaining time countdown
  React.useEffect(() => {
    if (lockoutTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((lockoutTime - now) / 1000));
        setRemainingTime(remaining);
        
        if (remaining === 0) {
          setLockoutTime(null);
          setLoginAttempts(0);
          localStorage.removeItem('buyerLoginLockout');
          localStorage.removeItem('buyerLoginAttempts');
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

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
    
    // Check if account is locked
    if (lockoutTime && Date.now() < lockoutTime) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      toast.error(`Account locked. Please try again in ${minutes}:${seconds.toString().padStart(2, '0')}`);
      return;
    }
    
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
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('buyerLoginAttempts');
        localStorage.removeItem('buyerLoginLockout');
        
        onAuthSuccess(response.user);
        toast.success(`Welcome back, ${response.user.firstName}! 🛒`);
        navigate('/buyer-dashboard');
      } else {
        // Increment failed login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('buyerLoginAttempts', newAttempts.toString());
        
        // Lock account after 15 failed attempts
        if (newAttempts >= 15) {
          const lockUntil = Date.now() + (10 * 60 * 1000); // 10 minutes
          setLockoutTime(lockUntil);
          localStorage.setItem('buyerLoginLockout', JSON.stringify({
            until: lockUntil,
            attempts: newAttempts
          }));
          toast.error('Too many failed attempts. Account locked for 10 minutes.');
        } else {
          const attemptsLeft = 15 - newAttempts;
          toast.error(`${response.message || 'Login failed'}. ${attemptsLeft} attempts remaining.`);
        }
        
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
        {lockoutTime && remainingTime > 0 && (
          <div className="login-lockout-alert">
            <div className="lockout-icon">🔒</div>
            <div className="lockout-content">
              <h4>Account Temporarily Locked</h4>
              <p>Too many failed attempts. Please try again in:</p>
              <div className="lockout-timer">
                {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        )}
        {loginAttempts > 0 && loginAttempts < 15 && !lockoutTime && (
          <div className={`login-attempts-alert ${loginAttempts >= 10 ? 'critical' : loginAttempts >= 5 ? 'warning' : 'info'}`}>
            <div className="attempts-icon">
              {loginAttempts >= 10 ? '⚠️' : loginAttempts >= 5 ? '⚡' : 'ℹ️'}
            </div>
            <div className="attempts-content">
              <div className="attempts-text">
                <strong>{15 - loginAttempts}</strong> login attempts remaining
              </div>
              <div className="attempts-progress-bar">
                <div 
                  className="attempts-progress-fill" 
                  style={{ width: `${((15 - loginAttempts) / 15) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <button type="submit" className="submit-btn buyer-btn" disabled={loading || (lockoutTime && remainingTime > 0)}>
          {loading ? 'Logging in...' : lockoutTime && remainingTime > 0 ? 'Account Locked' : 'Login'}
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