import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/authAPI';
import './BuyerSettings.css';

const BuyerSettings = ({ user }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false,
    email: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareData: false,
    marketingEmails: false,
    analytics: true
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30'
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preferences updated!');
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Privacy settings updated!');
  };

  const handleSecurityChange = (key) => {
    setSecurity(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Security settings updated!');
  };

  const handlePasswordChange = () => {
    // Navigate to password change page or show modal
    toast.info('Password change feature coming soon!');
  };

  const handleExportData = () => {
    toast.info('Data export will be available soon!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion feature coming soon!');
    }
  };

  return (
    <div className="buyer-settings">
      <div className="settings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            ← Back to Dashboard
          </button>
          <div className="header-content">
            <h1>⚙️ Account Settings</h1>
            <p>Manage your account preferences and security</p>
          </div>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <span className="nav-icon">🔔</span>
              <span className="nav-label">Notifications</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveSection('privacy')}
            >
              <span className="nav-icon">🛡️</span>
              <span className="nav-label">Privacy</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <span className="nav-icon">🔒</span>
              <span className="nav-label">Security</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              <span className="nav-icon">🎯</span>
              <span className="nav-label">Preferences</span>
            </button>
          </nav>
        </div>

        <div className="settings-content">
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>👤 Profile Information</h2>
                <p>Update your personal information and contact details</p>
              </div>

              <div className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={handleProfileSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🔔 Notification Preferences</h2>
                <p>Choose how you want to be notified about orders and updates</p>
              </div>

              <div className="notification-groups">
                <div className="notification-group">
                  <h3>Order Notifications</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Order Updates</h4>
                      <p>Get notified when your order status changes</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.orderUpdates}
                        onChange={() => handleNotificationChange('orderUpdates')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>SMS Notifications</h4>
                      <p>Receive text messages for important updates</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>Marketing Communications</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Promotional Offers</h4>
                      <p>Receive notifications about deals and discounts</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.promotions}
                        onChange={() => handleNotificationChange('promotions')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Newsletter</h4>
                      <p>Stay updated with our weekly newsletter</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.newsletter}
                        onChange={() => handleNotificationChange('newsletter')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🛡️ Privacy Settings</h2>
                <p>Control your privacy and data sharing preferences</p>
              </div>

              <div className="privacy-options">
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Profile Visibility</h4>
                    <p>Control who can see your profile information</p>
                  </div>
                  <select className="privacy-select">
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Data Sharing</h4>
                    <p>Allow us to share anonymized data for research</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={privacy.shareData}
                      onChange={() => handlePrivacyChange('shareData')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Marketing Emails</h4>
                    <p>Receive personalized marketing emails</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={privacy.marketingEmails}
                      onChange={() => handlePrivacyChange('marketingEmails')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="data-management">
                  <h3>Data Management</h3>
                  <div className="data-actions">
                    <button className="data-btn export" onClick={handleExportData}>
                      📥 Export My Data
                    </button>
                    <button className="data-btn delete" onClick={handleDeleteAccount}>
                      🗑️ Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🔒 Security Settings</h2>
                <p>Manage your account security and authentication</p>
              </div>

              <div className="security-options">
                <div className="security-item">
                  <div className="security-info">
                    <h4>Change Password</h4>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button className="security-btn" onClick={handlePasswordChange}>
                    🔑 Change Password
                  </button>
                </div>
                
                <div className="security-item">
                  <div className="security-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={security.twoFactorAuth}
                      onChange={() => handleSecurityChange('twoFactorAuth')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="security-item">
                  <div className="security-info">
                    <h4>Login Alerts</h4>
                    <p>Get notified of suspicious login attempts</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={security.loginAlerts}
                      onChange={() => handleSecurityChange('loginAlerts')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="security-item">
                  <div className="security-info">
                    <h4>Session Timeout</h4>
                    <p>Automatically log out after inactivity</p>
                  </div>
                  <select 
                    className="security-select"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🎯 Shopping Preferences</h2>
                <p>Customize your shopping experience</p>
              </div>

              <div className="preferences-options">
                <div className="preference-group">
                  <h3>Product Preferences</h3>
                  <div className="preference-item">
                    <label>Preferred Categories</label>
                    <div className="category-tags">
                      <span className="tag active">🥬 Vegetables</span>
                      <span className="tag">🍎 Fruits</span>
                      <span className="tag active">🌱 Organic</span>
                      <span className="tag">🥛 Dairy</span>
                      <span className="tag">🍞 Bakery</span>
                    </div>
                  </div>
                  
                  <div className="preference-item">
                    <label>Budget Range</label>
                    <select className="preference-select">
                      <option value="any">Any Budget</option>
                      <option value="low">Under Rs. 500</option>
                      <option value="medium">Rs. 500 - 2000</option>
                      <option value="high">Above Rs. 2000</option>
                    </select>
                  </div>
                </div>
                
                <div className="preference-group">
                  <h3>Delivery Preferences</h3>
                  <div className="preference-item">
                    <label>Preferred Delivery Time</label>
                    <select className="preference-select">
                      <option value="anytime">Anytime</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                  
                  <div className="preference-item">
                    <label>Special Instructions</label>
                    <textarea 
                      className="preference-textarea"
                      placeholder="Any special delivery instructions..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerSettings;