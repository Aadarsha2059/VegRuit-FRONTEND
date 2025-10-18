import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI, STORAGE_KEYS } from '../services/authAPI';
import './BuyerLogin.css';

const BuyerLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  // Focus on username field when component mounts
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgotPasswordForm = () => {
    const newErrors = {};

    if (!forgotPasswordData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(forgotPasswordData.email)) {
      newErrors.email = 'Email is invalid';
    }

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

        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, JSON.stringify(response.userType));

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateForgotPasswordForm()) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      setTimeout(() => {
        toast.success('Password reset instructions sent to your email!');
        setShowForgotPassword(false);
        setLoading(false);
        setForgotPasswordData({ email: '' });
      }, 1500);
    } catch (error) {
      toast.error('Failed to send password reset instructions');
      console.error('Forgot password error:', error);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      if (e.target.name === 'username') {
        e.preventDefault();
        const passwordField = document.querySelector('input[name="password"]');
        if (passwordField) {
          passwordField.focus();
        }
      } else if (e.target.name === 'password') {
        e.preventDefault();
        handleLogin(e);
      } else if (e.target.name === 'email') {
        e.preventDefault();
        handleForgotPassword(e);
      }
    }
  };

  const renderLoginBackground = () => (
    <div className="login-background">
      <img
        src="/src/assets/login_signup_images/buyer login page.png"
        alt="Buyer Login Background"
        className="background-image"
      />
      <div className="background-overlay"></div>
      <div className="decoration-element decoration-1">🛒</div>
      <div className="decoration-element decoration-2">🥕</div>
      <div className="glow-orb1"></div>
      <div className="glow-orb2"></div>
      <div className="glow-orb3"></div>
    </div>
  );

  if (showForgotPassword) {
    return (
      <div className="buyer-login-overlay">
        <div className="buyer-login-container">
          {renderLoginBackground()}

          <div className="login-content">
            <Link to="/" className="back-button">
              <span className="back-icon">←</span> Back to Home
            </Link>

            <div className="login-header">
              <div className="login-logo">
                <h1>🔑 Reset Password</h1>
                <p>Enter your email to reset your password securely</p>
              </div>
            </div>

            <form onSubmit={handleForgotPassword} className="login-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    onKeyDown={handleKeyDown}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span> Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="form-footer">
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setErrors({});
                  }}
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-login-overlay">
      <div className="buyer-login-container">
        {renderLoginBackground()}

        <div className="login-content">
          <Link to="/" className="back-button">
            <span className="back-icon">←</span> Back to Home
          </Link>

          <div className="login-header">
            <div className="login-logo">
              <h1>🛒 Buyer Portal</h1>
              <p>Welcome back! Sign in to access your personalized shopping experience</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  ref={usernameRef}
                  type="text"
                  name="username"
                  placeholder="Username or Email Address"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className={errors.username ? 'error' : ''}
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className={errors.password ? 'error' : ''}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> <span>Remember me for 30 days</span>
              </label>
              <button
                type="button"
                className="forgot-password"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span> Signing In...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              New to our marketplace?{' '}
              <Link to="/buyer-signup" className="signup-link">
                Create Buyer Account
              </Link>
            </p>
            <div className="social-login">
              <p>Or continue with social accounts</p>
              <div className="social-icons">
                <button className="social-btn google" aria-label="Continue with Google">
                  <span>G</span>
                </button>
                <button className="social-btn facebook" aria-label="Continue with Facebook">
                  <span>f</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;
