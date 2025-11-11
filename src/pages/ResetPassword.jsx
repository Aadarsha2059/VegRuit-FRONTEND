import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../services/authAPI';
import BackgroundAnimation from '../components/BackgroundAnimation';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      toast.error('Invalid reset link');
      navigate('/buyer-login');
    } else {
      setToken(resetToken);
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authAPI.resetPassword(token, formData.newPassword);
      
      if (response.success) {
        setResetSuccess(true);
        toast.success('Password reset successful!');
        setTimeout(() => {
          navigate('/buyer-login');
        }, 3000);
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <>
        <BackgroundAnimation />
        <div className="reset-password-container">
          <div className="reset-password-card success-card">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h2>Password Reset Successful!</h2>
            <p>Your password has been reset successfully.</p>
            <p className="redirect-message">Redirecting to login page...</p>
            <button 
              className="login-now-btn"
              onClick={() => navigate('/buyer-login')}
            >
              Login Now
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackgroundAnimation />
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-icon">
            <FaLock />
          </div>
          <h2>Reset Your Password</h2>
          <p className="reset-description">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="reset-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-with-icon password-input">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? 'error' : ''}
                  placeholder="Enter new password (min. 6 characters)"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-with-icon password-input">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your new password"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="reset-submit-btn"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
