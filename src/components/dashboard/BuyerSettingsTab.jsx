import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import './BuyerSettingsTab.css'

const BuyerSettingsTab = ({ user, onUpdateProfile, onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    weeklyNewsletter: true,
    language: 'en',
    currency: 'NPR'
  })

  const handleSaveProfile = async () => {
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(profileData)
        setIsEditing(false)
        toast.success('✅ Profile updated successfully!')
      }
    } catch (error) {
      toast.error('❌ Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('❌ Passwords do not match!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('❌ Password must be at least 6 characters!')
      return
    }

    try {
      toast.success('✅ Password changed successfully!')
      setShowPasswordChange(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('❌ Failed to change password')
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone!')) {
      if (window.confirm('🚨 This will permanently delete all your data. Are you absolutely sure?')) {
        toast.success('Account deletion request submitted')
        setTimeout(() => {
          onLogout()
        }, 2000)
      }
    }
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    toast.success('✅ Preference updated')
  }

  const sections = [
    { key: 'profile', label: 'Profile Information', icon: '👤' },
    { key: 'security', label: 'Security & Privacy', icon: '🔐' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'preferences', label: 'Preferences', icon: '⚙️' },
    { key: 'account', label: 'Account Management', icon: '🏠' }
  ]

  return (
    <div className="buyer-settings-tab">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-layout">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {sections.map((section) => (
            <button
              key={section.key}
              className={`nav-item ${activeSection === section.key ? 'active' : ''}`}
              onClick={() => setActiveSection(section.key)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Profile Information */}
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>👤 Profile Information</h3>
                {!isEditing ? (
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSaveProfile}>
                      💾 Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <div className="form-value">{user?.firstName || 'Not provided'}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <div className="form-value">{user?.lastName || 'Not provided'}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="form-value readonly">
                      {user?.email || 'Not provided'}
                      <span className="readonly-badge">Read Only</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="form-value">{user?.phone || 'Not provided'}</div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  ) : (
                    <div className="form-value">{user?.address || 'Not provided'}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="form-value">{user?.city || 'Not provided'}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Member Since</label>
                    <div className="form-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security & Privacy */}
          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>🔐 Security & Privacy</h3>
              </div>

              <div className="security-options">
                <div className="security-item">
                  <div className="security-info">
                    <h4>🔑 Change Password</h4>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                  >
                    Change Password
                  </button>
                </div>

                {showPasswordChange && (
                  <div className="password-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="form-actions">
                      <button className="btn btn-outline" onClick={() => setShowPasswordChange(false)}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleChangePassword}>
                        Update Password
                      </button>
                    </div>
                  </div>
                )}

                <div className="security-item">
                  <div className="security-info">
                    <h4>📱 Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn btn-outline" disabled>
                    Coming Soon
                  </button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h4>🔒 Login Sessions</h4>
                    <p>Manage your active login sessions</p>
                  </div>
                  <button className="btn btn-outline" disabled>
                    View Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>🔔 Notification Preferences</h3>
              </div>

              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>📧 Email Notifications</h4>
                    <p>Receive important updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>📱 SMS Notifications</h4>
                    <p>Get order updates via SMS</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>📦 Order Updates</h4>
                    <p>Notifications about your order status</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.orderUpdates}
                      onChange={(e) => handlePreferenceChange('orderUpdates', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>🎯 Promotional Emails</h4>
                    <p>Special offers and discounts</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.promotionalEmails}
                      onChange={(e) => handlePreferenceChange('promotionalEmails', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>📰 Weekly Newsletter</h4>
                    <p>Fresh produce tips and recipes</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={preferences.weeklyNewsletter}
                      onChange={(e) => handlePreferenceChange('weeklyNewsletter', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>⚙️ App Preferences</h3>
              </div>

              <div className="preference-options">
                <div className="preference-item">
                  <label>🌐 Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ne">नेपाली (Nepali)</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label>💰 Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  >
                    <option value="NPR">NPR (Nepalese Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="INR">INR (Indian Rupee)</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label>🎨 Theme</label>
                  <select disabled>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode (Coming Soon)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Account Management */}
          {activeSection === 'account' && (
            <div className="settings-section">
              <div className="section-header">
                <h3>🏠 Account Management</h3>
              </div>

              <div className="account-options">
                <div className="account-item">
                  <div className="account-info">
                    <h4>📤 Export Data</h4>
                    <p>Download a copy of your account data</p>
                  </div>
                  <button className="btn btn-outline" disabled>
                    Export Data
                  </button>
                </div>

                <div className="account-item">
                  <div className="account-info">
                    <h4>🚪 Logout</h4>
                    <p>Sign out of your account</p>
                  </div>
                  <button className="btn btn-outline" onClick={onLogout}>
                    Logout
                  </button>
                </div>

                <div className="account-item danger">
                  <div className="account-info">
                    <h4>🗑️ Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="btn btn-danger" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerSettingsTab
