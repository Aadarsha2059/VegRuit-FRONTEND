import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import './ProfileTab.css'

const ProfileTab = ({ user, orders, favorites, onUpdateProfile, onLogout }) => {
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

  // Calculate real statistics
  const stats = {
    totalOrders: orders?.length || 0,
    completedOrders: orders?.filter(o => o.status === 'delivered').length || 0,
    pendingOrders: orders?.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length || 0,
    totalSpent: orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
    favoriteProducts: favorites?.length || 0,
    accountAge: user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0
  }

  const handleSaveProfile = async () => {
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(profileData)
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters!')
      return
    }

    try {
      // Call API to change password
      toast.success('Password changed successfully!')
      setShowPasswordChange(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('Failed to change password')
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        // Call API to delete account
        toast.success('Account deletion request submitted')
        setTimeout(() => {
          onLogout()
        }, 2000)
      }
    }
  }

  const getRecentActivity = () => {
    const activities = []
    
    // Add order activities
    orders?.slice(0, 5).forEach(order => {
      activities.push({
        type: 'order',
        icon: '📦',
        title: `Order #${order.orderNumber}`,
        description: `${order.status} - Rs. ${order.total.toFixed(2)}`,
        date: new Date(order.orderDate)
      })
    })

    // Sort by date
    return activities.sort((a, b) => b.date - a.date).slice(0, 10)
  }

  return (
    <div className="profile-tab">
      <div className="profile-header">
        <h2>👤 My Profile</h2>
        <p>Manage your account information and preferences</p>
      </div>

      {/* Profile Statistics */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">{stats.completedOrders}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-value">Rs. {stats.totalSpent.toFixed(0)}</span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <span className="stat-value">{stats.favoriteProducts}</span>
            <span className="stat-label">Favorites</span>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Personal Information</h3>
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

        <div className="profile-info-grid">
          <div className="info-item">
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              />
            ) : (
              <span className="info-value">{user?.firstName || 'N/A'}</span>
            )}
          </div>

          <div className="info-item">
            <label>Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              />
            ) : (
              <span className="info-value">{user?.lastName || 'N/A'}</span>
            )}
          </div>

          <div className="info-item">
            <label>Email</label>
            <span className="info-value">{user?.email || 'N/A'}</span>
          </div>

          <div className="info-item">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            ) : (
              <span className="info-value">{user?.phone || 'N/A'}</span>
            )}
          </div>

          <div className="info-item full-width">
            <label>Address</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              />
            ) : (
              <span className="info-value">{user?.address || 'N/A'}</span>
            )}
          </div>

          <div className="info-item">
            <label>City</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({...profileData, city: e.target.value})}
              />
            ) : (
              <span className="info-value">{user?.city || 'N/A'}</span>
            )}
          </div>

          <div className="info-item">
            <label>Member Since</label>
            <span className="info-value">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              {stats.accountAge > 0 && ` (${stats.accountAge} days ago)`}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="profile-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {getRecentActivity().length > 0 ? (
            getRecentActivity().map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-date">
                    {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-activity">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Section */}
      <div className="profile-section">
        <h3>🔐 Security</h3>
        <div className="security-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            🔑 Change Password
          </button>
        </div>

        {showPasswordChange && (
          <div className="password-change-form">
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
      </div>

      {/* Danger Zone */}
      <div className="profile-section danger-zone">
        <h3>⚠️ Danger Zone</h3>
        <p>Once you delete your account, there is no going back. Please be certain.</p>
        <button className="btn btn-danger" onClick={handleDeleteAccount}>
          🗑️ Delete Account
        </button>
      </div>
    </div>
  )
}

export default ProfileTab
