import React, { useState } from 'react'
import './DashboardTabs.css'

const ProfileTab = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.name ? user.name.split(' ')[0] : '',
    lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
    email: user.email || '',
    phone: user.phone || '',
    deliveryAddress: user.deliveryAddress || '',
    city: user.city || 'Kathmandu'
  })

  const cities = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kirtipur', 'Thimi',
    'Madhyapur Thimi', 'Tokha', 'Chandragiri', 'Budhanilkantha',
    'Tarakeshwar', 'Dakshinkali', 'Shankharapur', 'Kageshwari Manohara',
    'Gokarneshwar', 'Suryabinayak', 'Changunarayan', 'Nagarkot',
    'Banepa', 'Panauti', 'Dhulikhel'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedUser = {
      ...user,
      name: `${formData.firstName} ${formData.lastName}`,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      deliveryAddress: formData.deliveryAddress,
      city: formData.city
    }
    onUpdateProfile(updatedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.name ? user.name.split(' ')[0] : '',
      lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
      email: user.email || '',
      phone: user.phone || '',
      deliveryAddress: user.deliveryAddress || '',
      city: user.city || 'Kathmandu'
    })
    setIsEditing(false)
  }

  return (
    <div className="profile-tab">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.avatar} alt={user.name || user.fullName} />
          <button className="avatar-edit-btn">📷</button>
        </div>
        <div className="profile-info">
          <h2>{user.name || user.fullName}</h2>
          <p>{user.email}</p>
          <p>Member since {new Date(user.signupTime || user.loginTime).toLocaleDateString()}</p>
        </div>
        <button 
          className="edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Form */}
      <div className="profile-form">
        <h3>Personal Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="deliveryAddress">Delivery Address</label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Security */}
      <div className="account-security">
        <h3>Account Security</h3>
        <div className="security-options">
          <div className="security-option">
            <div className="security-info">
              <h4>Password</h4>
              <p>Last changed: {new Date().toLocaleDateString()}</p>
            </div>
            <button className="btn btn-outline">Change Password</button>
          </div>
          
          <div className="security-option">
            <div className="security-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security</p>
            </div>
            <button className="btn btn-outline">Enable 2FA</button>
          </div>
          
          <div className="security-option">
            <div className="security-info">
              <h4>Login Sessions</h4>
              <p>Manage your active sessions</p>
            </div>
            <button className="btn btn-outline">View Sessions</button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="preferences">
        <h3>Preferences</h3>
        <div className="preferences-grid">
          <div className="preference-item">
            <label className="checkbox-wrapper">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span>
              Email notifications for orders
            </label>
          </div>
          <div className="preference-item">
            <label className="checkbox-wrapper">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span>
              SMS notifications for delivery
            </label>
          </div>
          <div className="preference-item">
            <label className="checkbox-wrapper">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Marketing communications
            </label>
          </div>
          <div className="preference-item">
            <label className="checkbox-wrapper">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span>
              Weekly newsletter
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileTab
