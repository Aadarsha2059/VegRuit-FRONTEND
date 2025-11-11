import React, { useState } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/authAPI';
import './ForgotPasswordDialog.css';

const ForgotPasswordDialog = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authAPI.requestPasswordReset(email.trim().toLowerCase());
      
      if (response.success) {
        setEmailSent(true);
        toast.success('Password reset link sent! Check your email.');
      } else {
        toast.error(response.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-overlay" onClick={handleClose}>
      <div className="forgot-password-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="close-dialog-btn" onClick={handleClose} aria-label="Close">
          <FaTimes />
        </button>

        {!emailSent ? (
          <>
            <div className="dialog-icon">
              <FaEnvelope />
            </div>
            <h2>Forgot Password?</h2>
            <p className="dialog-description">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="dialog-form-group">
                <label htmlFor="reset-email">Email Address</label>
                <div className="dialog-input-wrapper">
                  <FaEnvelope className="dialog-input-icon" />
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="dialog-submit-btn"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="dialog-icon success">
              <FaEnvelope />
            </div>
            <h2>Check Your Email</h2>
            <p className="dialog-description">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="dialog-note">
              Please check your inbox and click the link to reset your password. 
              The link will expire in 1 hour.
            </p>
            <button 
              className="dialog-submit-btn"
              onClick={handleClose}
            >
              Got It
            </button>
            <button 
              className="dialog-resend-btn"
              onClick={() => {
                setEmailSent(false);
                handleSubmit({ preventDefault: () => {} });
              }}
            >
              Resend Link
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordDialog;
