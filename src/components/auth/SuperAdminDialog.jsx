import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaUser, FaLock, FaTimes } from 'react-icons/fa';
import './SuperAdminDialog.css';

const SuperAdminDialog = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded superadmin credentials
    if (formData.username === 'admin_aadarsha' && formData.password === 'admin_password') {
      // Store superadmin session
      localStorage.setItem('superadminLoggedIn', 'true');
      localStorage.setItem('superadminData', JSON.stringify({
        username: 'admin_aadarsha',
        role: 'superadmin',
        loginTime: new Date().toISOString()
      }));
      
      toast.success('Welcome, Super Admin! 🛡️');
      onClose();
      navigate('/superadmin-dashboard');
    } else {
      toast.error('Invalid superadmin credentials!');
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="superadmin-dialog-overlay" onClick={onClose}>
      <div className="superadmin-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="superadmin-header">
          <div className="superadmin-icon">
            <FaShieldAlt />
          </div>
          <h2>Super Admin Access</h2>
          <p>Restricted Area - Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="superadmin-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                required
              />
            </div>
          </div>

          <button type="submit" className="superadmin-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="superadmin-footer">
          <p className="warning-text">⚠️ Unauthorized access is prohibited</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDialog;
