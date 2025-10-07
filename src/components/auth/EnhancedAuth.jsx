import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { authAPI, STORAGE_KEYS } from '../../services/authAPI'
import './EnhancedAuth.css'

const EnhancedAuth = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState('role-selection') // 'role-selection', 'login', 'signup'
  const [selectedRoles, setSelectedRoles] = useState([])
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    farmName: '',
    farmLocation: ''
  })
  const [errors, setErrors] = useState({})

  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleNext = () => {
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one role')
      return
    }
    setCurrentStep(authMode)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (authMode === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required'
      }
      
      if (selectedRoles.includes('buyer') && !formData.address.trim()) {
        newErrors.address = 'Address is required for buyers'
      }
      if (selectedRoles.includes('seller') && !formData.farmName.trim()) {
        newErrors.farmName = 'Farm name is required for sellers'
      }
      if (selectedRoles.includes('seller') && !formData.farmLocation.trim()) {
        newErrors.farmLocation = 'Farm location is required for sellers'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }
    
    setLoading(true)
    
    try {
      let result
      
      if (authMode === 'login') {
        result = await authAPI.loginBuyer({
          username: formData.username,
          password: formData.password
        })
      } else {
        // Registration based on selected roles
        const userData = {
          username: formData.username.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          userType: selectedRoles,
          isBuyer: selectedRoles.includes('buyer'),
          isSeller: selectedRoles.includes('seller')
        }
        
        // Add role-specific fields
        if (selectedRoles.includes('buyer')) {
          userData.address = formData.address.trim()
        }
        if (selectedRoles.includes('seller')) {
          userData.farmName = formData.farmName.trim()
          userData.farmLocation = formData.farmLocation.trim()
        }
        
        // Register as buyer if buyer role is selected
        if (selectedRoles.includes('buyer')) {
          result = await authAPI.registerBuyer(userData)
        } else if (selectedRoles.includes('seller')) {
          result = await authAPI.registerSeller(userData)
        }
      }
      
      if (result.success) {
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, JSON.stringify(result.user.userType))
        
        toast.success(result.message)
        onSuccess(result.user)
      } else {
        toast.error(result.message)
        if (result.field) {
          setErrors({ [result.field]: result.message })
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      farmName: '',
      farmLocation: ''
    })
    setErrors({})
  }

  const handleModeSwitch = (mode) => {
    setAuthMode(mode)
    resetForm()
    setCurrentStep('role-selection')
  }

  return (
    <div className="enhanced-auth-overlay">
      <div className="enhanced-auth-container">
        <div className="auth-header">
          <h2>Welcome to VegRuit</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="auth-content">
          {currentStep === 'role-selection' && (
            <RoleSelectionStep
              selectedRoles={selectedRoles}
              onRoleToggle={handleRoleToggle}
              onNext={handleNext}
              authMode={authMode}
              onModeSwitch={handleModeSwitch}
            />
          )}

          {(currentStep === 'login' || currentStep === 'signup') && (
            <AuthFormStep
              authMode={authMode}
              selectedRoles={selectedRoles}
              formData={formData}
              errors={errors}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onBack={() => setCurrentStep('role-selection')}
              onModeSwitch={handleModeSwitch}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const RoleSelectionStep = ({ selectedRoles, onRoleToggle, onNext, authMode, onModeSwitch }) => (
  <div className="role-selection-step">
    <div className="step-header">
      <h3>Choose Your Role</h3>
      <p>Select how you want to use VegRuit. You can choose multiple roles!</p>
    </div>

    <div className="role-options">
      <div 
        className={`role-card ${selectedRoles.includes('buyer') ? 'selected' : ''}`}
        onClick={() => onRoleToggle('buyer')}
      >
        <div className="role-icon">🛒</div>
        <h4>Buyer</h4>
        <p>Shop for fresh fruits and vegetables from local farmers</p>
        <ul>
          <li>Browse products by category</li>
          <li>Add to cart and checkout</li>
          <li>Track your orders</li>
          <li>Rate and review products</li>
        </ul>
      </div>

      <div 
        className={`role-card ${selectedRoles.includes('seller') ? 'selected' : ''}`}
        onClick={() => onRoleToggle('seller')}
      >
        <div className="role-icon">🌱</div>
        <h4>Seller</h4>
        <p>Sell your fresh produce directly to customers</p>
        <ul>
          <li>Create product categories</li>
          <li>Manage your inventory</li>
          <li>Process customer orders</li>
          <li>Track your earnings</li>
        </ul>
      </div>
    </div>

    <div className="auth-mode-toggle">
      <div className="mode-buttons">
        <button 
          className={`mode-btn ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => onModeSwitch('login')}
        >
          Login
        </button>
        <button 
          className={`mode-btn ${authMode === 'signup' ? 'active' : ''}`}
          onClick={() => onModeSwitch('signup')}
        >
          Sign Up
        </button>
      </div>
    </div>

    <div className="step-actions">
      <button className="btn btn-primary" onClick={onNext}>
        Continue as {selectedRoles.length > 1 ? 'Both' : selectedRoles[0] || 'User'}
      </button>
    </div>
  </div>
)

const AuthFormStep = ({ authMode, selectedRoles, formData, errors, loading, onInputChange, onSubmit, onBack, onModeSwitch }) => (
  <div className="auth-form-step">
    <div className="step-header">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h3>{authMode === 'login' ? 'Login' : 'Sign Up'} as {selectedRoles.join(' & ')}</h3>
    </div>

    <form onSubmit={onSubmit} className="auth-form">
      <div className="form-section">
        <h4>Account Information</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={onInputChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
      </div>

      {authMode === 'signup' && (
        <>
          <div className="form-section">
            <h4>Personal Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onInputChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onInputChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={onInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={onInputChange}
                  className={errors.city ? 'error' : ''}
                  placeholder="Enter your city"
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
            </div>
          </div>

          {selectedRoles.includes('buyer') && (
            <div className="form-section">
              <h4>Buyer Information</h4>
              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={onInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter your delivery address"
                  rows="3"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>
          )}

          {selectedRoles.includes('seller') && (
            <div className="form-section">
              <h4>Seller Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="farmName">Farm Name *</label>
                  <input
                    type="text"
                    id="farmName"
                    name="farmName"
                    value={formData.farmName}
                    onChange={onInputChange}
                    className={errors.farmName ? 'error' : ''}
                    placeholder="Enter your farm name"
                  />
                  {errors.farmName && <span className="error-text">{errors.farmName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="farmLocation">Farm Location *</label>
                  <input
                    type="text"
                    id="farmLocation"
                    name="farmLocation"
                    value={formData.farmLocation}
                    onChange={onInputChange}
                    className={errors.farmLocation ? 'error' : ''}
                    placeholder="Enter your farm location"
                  />
                  {errors.farmLocation && <span className="error-text">{errors.farmLocation}</span>}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="form-section">
        <h4>Security</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          {authMode === 'signup' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : `${authMode === 'login' ? 'Login' : 'Sign Up'}`}
        </button>
        
        <div className="auth-switch">
          <p>
            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="switch-btn"
              onClick={() => onModeSwitch(authMode === 'login' ? 'signup' : 'login')}
            >
              {authMode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </form>
  </div>
)

export default EnhancedAuth