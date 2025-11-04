import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/authAPI';
import './SellerSettings.css';

const SellerSettings = ({ user }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    farmName: user?.farmName || '',
    farmLocation: user?.farmLocation || '',
    city: user?.city || '',
    description: user?.description || ''
  });

  // Business settings
  const [businessData, setBusinessData] = useState({
    businessType: 'individual',
    taxId: '',
    businessLicense: '',
    bankAccount: '',
    bankName: '',
    accountHolder: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    lowStock: true,
    payments: true,
    marketing: false,
    newsletter: true
  });

  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: user?.farmName || '',
    storeDescription: '',
    operatingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '16:00', closed: false },
      sunday: { open: '08:00', close: '16:00', closed: true }
    },
    deliveryRadius: '10',
    minimumOrder: '500'
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

  const handleBusinessSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Business information updated successfully!');
    } catch (error) {
      toast.error('Failed to update business information');
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

  const handleStoreSettingsSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Store settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update store settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    toast.info('Password change feature coming soon!');
  };

  const handleExportData = () => {
    toast.info('Data export will be available soon!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your seller account? This action cannot be undone.')) {
      toast.error('Account deletion feature coming soon!');
    }
  };

  return (
    <div className="seller-settings">
      <div className="settings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            ← Back to Dashboard
          </button>
          <div className="header-content">
            <h1>⚙️ Seller Settings</h1>
            <p>Manage your farm business and account preferences</p>
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
              className={`nav-item ${activeSection === 'business' ? 'active' : ''}`}
              onClick={() => setActiveSection('business')}
            >
              <span className="nav-icon">🏢</span>
              <span className="nav-label">Business Info</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'store' ? 'active' : ''}`}
              onClick={() => setActiveSection('store')}
            >
              <span className="nav-icon">🏪</span>
              <span className="nav-label">Store Settings</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <span className="nav-icon">🔔</span>
              <span className="nav-label">Notifications</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <span className="nav-icon">🔒</span>
              <span className="nav-label">Security</span>
            </button>
          </nav>
        </div>

        <div className="settings-content">
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>👤 Profile Information</h2>
                <p>Update your personal and farm information</p>
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
                  <div className="form-group">
                    <label>Farm Name</label>
                    <input
                      type="text"
                      value={profileData.farmName}
                      onChange={(e) => setProfileData({...profileData, farmName: e.target.value})}
                      placeholder="Enter your farm name"
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
                  <div className="form-group full-width">
                    <label>Farm Location</label>
                    <input
                      type="text"
                      value={profileData.farmLocation}
                      onChange={(e) => setProfileData({...profileData, farmLocation: e.target.value})}
                      placeholder="Enter your farm location"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Farm Description</label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                      placeholder="Describe your farm and farming practices..."
                      rows="4"
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

          {activeSection === 'business' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🏢 Business Information</h2>
                <p>Manage your business details and payment information</p>
              </div>

              <div className="business-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Business Type</label>
                    <select
                      value={businessData.businessType}
                      onChange={(e) => setBusinessData({...businessData, businessType: e.target.value})}
                    >
                      <option value="individual">Individual Farmer</option>
                      <option value="partnership">Partnership</option>
                      <option value="cooperative">Cooperative</option>
                      <option value="company">Company</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tax ID (Optional)</label>
                    <input
                      type="text"
                      value={businessData.taxId}
                      onChange={(e) => setBusinessData({...businessData, taxId: e.target.value})}
                      placeholder="Enter your tax ID"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Business License (Optional)</label>
                    <input
                      type="text"
                      value={businessData.businessLicense}
                      onChange={(e) => setBusinessData({...businessData, businessLicense: e.target.value})}
                      placeholder="Enter your business license number"
                    />
                  </div>
                </div>

                <div className="payment-section">
                  <h3>💳 Payment Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        value={businessData.bankName}
                        onChange={(e) => setBusinessData({...businessData, bankName: e.target.value})}
                        placeholder="Enter your bank name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Account Holder Name</label>
                      <input
                        type="text"
                        value={businessData.accountHolder}
                        onChange={(e) => setBusinessData({...businessData, accountHolder: e.target.value})}
                        placeholder="Enter account holder name"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Bank Account Number</label>
                      <input
                        type="text"
                        value={businessData.bankAccount}
                        onChange={(e) => setBusinessData({...businessData, bankAccount: e.target.value})}
                        placeholder="Enter your bank account number"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={handleBusinessSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : '💾 Save Business Info'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'store' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🏪 Store Settings</h2>
                <p>Configure your online store and delivery options</p>
              </div>

              <div className="store-form">
                <div className="store-info">
                  <h3>Store Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Store Name</label>
                      <input
                        type="text"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                        placeholder="Enter your store name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Delivery Radius (km)</label>
                      <input
                        type="number"
                        value={storeSettings.deliveryRadius}
                        onChange={(e) => setStoreSettings({...storeSettings, deliveryRadius: e.target.value})}
                        placeholder="10"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Minimum Order Amount (Rs.)</label>
                      <input
                        type="number"
                        value={storeSettings.minimumOrder}
                        onChange={(e) => setStoreSettings({...storeSettings, minimumOrder: e.target.value})}
                        placeholder="500"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Store Description</label>
                      <textarea
                        value={storeSettings.storeDescription}
                        onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
                        placeholder="Describe your store and what makes it special..."
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="operating-hours">
                  <h3>⏰ Operating Hours</h3>
                  <div className="hours-grid">
                    {Object.entries(storeSettings.operatingHours).map(([day, hours]) => (
                      <div key={day} className="day-hours">
                        <div className="day-name">
                          <label className="day-checkbox">
                            <input
                              type="checkbox"
                              checked={!hours.closed}
                              onChange={(e) => setStoreSettings({
                                ...storeSettings,
                                operatingHours: {
                                  ...storeSettings.operatingHours,
                                  [day]: { ...hours, closed: !e.target.checked }
                                }
                              })}
                            />
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </label>
                        </div>
                        {!hours.closed && (
                          <div className="time-inputs">
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => setStoreSettings({
                                ...storeSettings,
                                operatingHours: {
                                  ...storeSettings.operatingHours,
                                  [day]: { ...hours, open: e.target.value }
                                }
                              })}
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => setStoreSettings({
                                ...storeSettings,
                                operatingHours: {
                                  ...storeSettings.operatingHours,
                                  [day]: { ...hours, close: e.target.value }
                                }
                              })}
                            />
                          </div>
                        )}
                        {hours.closed && (
                          <div className="closed-indicator">Closed</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={handleStoreSettingsSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : '💾 Save Store Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>🔔 Notification Preferences</h2>
                <p>Choose how you want to be notified about your business</p>
              </div>

              <div className="notification-groups">
                <div className="notification-group">
                  <h3>Order Notifications</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>New Orders</h4>
                      <p>Get notified immediately when you receive new orders</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.newOrders}
                        onChange={() => handleNotificationChange('newOrders')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Order Updates</h4>
                      <p>Notifications when order status changes</p>
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
                </div>

                <div className="notification-group">
                  <h3>Business Notifications</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Low Stock Alerts</h4>
                      <p>Get notified when your products are running low</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.lowStock}
                        onChange={() => handleNotificationChange('lowStock')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Payment Notifications</h4>
                      <p>Notifications about payments and earnings</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.payments}
                        onChange={() => handleNotificationChange('payments')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>Marketing Communications</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Marketing Tips</h4>
                      <p>Receive tips to improve your sales</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.marketing}
                        onChange={() => handleNotificationChange('marketing')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Newsletter</h4>
                      <p>Stay updated with platform news and updates</p>
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
                    <p>Add an extra layer of security to your seller account</p>
                  </div>
                  <button className="security-btn">
                    🛡️ Enable 2FA
                  </button>
                </div>
                
                <div className="security-item">
                  <div className="security-info">
                    <h4>Login Sessions</h4>
                    <p>View and manage your active login sessions</p>
                  </div>
                  <button className="security-btn">
                    👁️ View Sessions
                  </button>
                </div>
                
                <div className="data-management">
                  <h3>Data Management</h3>
                  <div className="data-actions">
                    <button className="data-btn export" onClick={handleExportData}>
                      📥 Export Business Data
                    </button>
                    <button className="data-btn delete" onClick={handleDeleteAccount}>
                      🗑️ Delete Seller Account
                    </button>
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

export default SellerSettings;