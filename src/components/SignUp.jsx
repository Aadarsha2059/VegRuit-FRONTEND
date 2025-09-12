import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI, USER_TYPES, STORAGE_KEYS } from '../services/authAPI'
import { navigateToDashboard, getUserTypeDisplayName } from '../utils/navigation'
import '../styles/Auth.css'

const SignUp = ({ onClose, onSuccess, onSwitchToLogin, defaultUserType = USER_TYPES.BUYER }) => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState(defaultUserType)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Kathmandu',
    farmName: '',
    farmLocation: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const cities = [
    'Kathmandu',
    'Lalitpur',
    'Bhaktapur',
    'Kirtipur',
    'Thimi',
    'Madhyapur Thimi',
    'Tokha',
    'Chandragiri',
    'Budhanilkantha',
    'Tarakeshwar',
    'Dakshinkali',
    'Shankharapur',
    'Kageshwari Manohara',
    'Gokarneshwar',
    'Suryabinayak',
    'Changunarayan',
    'Nagarkot',
    'Banepa',
    'Panauti',
    'Dhulikhel'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: null
      })
    }
    
    // Real-time validation for specific fields
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        setFieldErrors({
          ...fieldErrors,
          email: 'Please enter a valid email address'
        })
      }
    }
    
    if (name === 'confirmPassword') {
      if (value && value !== formData.password) {
        setFieldErrors({
          ...fieldErrors,
          confirmPassword: 'Passwords do not match'
        })
      }
    }
    
    if (name === 'username') {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
      if (value && !usernameRegex.test(value)) {
        setFieldErrors({
          ...fieldErrors,
          username: 'Username must be 3-20 characters, letters, numbers, and underscores only'
        })
      }
    }
  }

  const checkUsernameAvailability = async (username) => {
    if (username.length < 3) return
    
    setIsCheckingUsername(true)
    try {
      const result = await authAPI.checkUserExists(username, null)
      if (result.success && result.exists) {
        setFieldErrors(prev => ({
          ...prev,
          username: `Username already taken by a ${result.userType}`
        }))
      } else {
        setFieldErrors(prev => ({
          ...prev,
          username: null
        }))
      }
    } catch (error) {
      // Silently handle errors
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const checkEmailAvailability = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return
    
    setIsCheckingEmail(true)
    try {
      const result = await authAPI.checkUserExists(null, email)
      if (result.success && result.exists) {
        setFieldErrors(prev => ({
          ...prev,
          email: `Email already registered as a ${result.userType}`
        }))
      } else {
        setFieldErrors(prev => ({
          ...prev,
          email: null
        }))
      }
    } catch (error) {
      // Silently handle errors
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleUsernameBlur = () => {
    if (formData.username) {
      checkUsernameAvailability(formData.username)
    }
  }

  const handleEmailBlur = () => {
    if (formData.email) {
      checkEmailAvailability(formData.email)
    }
  }

  const validateForm = () => {
    // Check required fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.username || !formData.password || 
        !formData.confirmPassword || !formData.city) {
      toast.error('Please fill in all required fields')
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    // Validate phone number (basic Nepal format)
    const phoneRegex = /^(\+977)?[0-9]{10}$/
    if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
      toast.error('Please enter a valid phone number')
      return false
    }

    // Validate username (alphanumeric, 3-20 characters)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(formData.username)) {
      toast.error('Username must be 3-20 characters long and contain only letters, numbers, and underscores')
      return false
    }

    // Check user type specific fields
    if (userType === USER_TYPES.BUYER && !formData.address) {
      toast.error('Please enter your delivery address')
      return false
    }

    if (userType === USER_TYPES.SELLER && (!formData.farmName || !formData.farmLocation)) {
      toast.error('Please enter farm name and location')
      return false
    }

    // Validate password
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      let userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        username: formData.username.trim(),
        password: formData.password,
        city: formData.city
      }

      // Add user type specific fields
      if (userType === USER_TYPES.BUYER) {
        userData.address = formData.address.trim()
      } else if (userType === USER_TYPES.SELLER) {
        userData.farmName = formData.farmName.trim()
        userData.farmLocation = formData.farmLocation.trim()
      }

      let response
      if (userType === USER_TYPES.BUYER) {
        response = await authAPI.registerBuyer(userData)
      } else {
        response = await authAPI.registerSeller(userData)
      }

      if (response.success) {
        const actualUserType = response.userType || response.user.userType
        
        // Show success message
        toast.success(`🎉 ${response.message}`, {
          duration: 3000,
          icon: '✅'
        })
        
        // Show welcome message and redirect to login
        setTimeout(() => {
          toast.success(`✅ Account created successfully! Please login to continue.`, {
            duration: 4000
          })
          
          // Switch to login with the same user type
          setTimeout(() => {
            onSwitchToLogin(actualUserType)
          }, 1000)
        }, 2000)
      } else {
        // Handle specific error cases
        if (response.field === 'username') {
          setFieldErrors(prev => ({ ...prev, username: response.message }))
          toast.error(`❌ ${response.message}`)
          if (response.suggestion) {
            setTimeout(() => toast.error(`💡 ${response.suggestion}`), 1000)
          }
        } else if (response.field === 'email') {
          setFieldErrors(prev => ({ ...prev, email: response.message }))
          toast.error(`❌ ${response.message}`)
          if (response.suggestion) {
            setTimeout(() => toast.error(`💡 ${response.suggestion}`), 1000)
          }
        } else if (response.existingUserType) {
          toast.error(`❌ ${response.message}`)
          setTimeout(() => {
            toast.error(`💡 ${response.suggestion}`)
            // Suggest switching to login
            setTimeout(() => {
              toast.info(`🔄 Try logging in as a ${getUserTypeDisplayName(response.existingUserType)} instead`)
            }, 2000)
          }, 1000)
        } else {
          toast.error(`❌ ${response.message || 'Registration failed. Please try again.'}`)
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('🌐 Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={handleBackdropClick}>
      <div className="auth-modal signup-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="auth-container">
          <div className="auth-card signup-card">
            <div className="auth-header">
              <div className="auth-logo">
                <h2>🥬 VegRuit</h2>
                <p>Fresh from Kathmandu Valley</p>
              </div>
              
              {/* User Type Toggle */}
              <div className="user-type-toggle">
                <button 
                  className={`toggle-btn ${userType === USER_TYPES.BUYER ? 'active' : ''}`}
                  onClick={() => setUserType(USER_TYPES.BUYER)}
                  disabled={isLoading}
                >
                  <span className="toggle-icon">🛒</span>
                  <span className="toggle-text">Buyer Sign Up</span>
                </button>
                <button 
                  className={`toggle-btn ${userType === USER_TYPES.SELLER ? 'active' : ''}`}
                  onClick={() => setUserType(USER_TYPES.SELLER)}
                  disabled={isLoading}
                >
                  <span className="toggle-icon">👨‍🌾</span>
                  <span className="toggle-text">Seller Sign Up</span>
                </button>
              </div>

              <h1>Create Your Account! 🚀</h1>
              <p>Join VegRuit as a {userType === USER_TYPES.BUYER ? 'buyer' : 'seller'} and start your fresh produce journey today</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form signup-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      placeholder="your.email@example.com"
                      required
                      className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                    />
                    {isCheckingEmail && <span className="checking-indicator">⏳</span>}
                  </div>
                  {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📱</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleUsernameBlur}
                    placeholder="Choose a unique username"
                    required
                    className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                  />
                  {isCheckingUsername && <span className="checking-indicator">⏳</span>}
                </div>
                {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
                </div>
              </div>

              {userType === USER_TYPES.BUYER ? (
                <div className="form-group">
                  <label htmlFor="address">Delivery Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📍</span>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your delivery address"
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="farmName">Farm Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🏡</span>
                      <input
                        type="text"
                        id="farmName"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleChange}
                        placeholder="Enter your farm name"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="farmLocation">Farm Location</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📍</span>
                      <input
                        type="text"
                        id="farmLocation"
                        name="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleChange}
                        placeholder="Enter your farm location"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="city">City</label>
                <div className="input-wrapper">
                  <span className="input-icon">🏙️</span>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  I agree to the{' '}
                  <button type="button" className="terms-link">
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button type="button" className="terms-link">
                    Privacy Policy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                className={`auth-btn primary signup-submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">{userType === USER_TYPES.BUYER ? '🛒' : '👨‍🌾'}</span>
                    <span>Create {userType === USER_TYPES.BUYER ? 'Buyer' : 'Seller'} Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="social-auth">
              <button className="social-btn google">
                <span>🔍</span>
                Continue with Google
              </button>
              <button className="social-btn facebook">
                <span>📘</span>
                Continue with Facebook
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <button 
                  type="button"
                  className="auth-link"
                  onClick={() => onSwitchToLogin(userType)}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          <div className="auth-image">
            <div className="image-overlay">
              <h2>{userType === USER_TYPES.BUYER ? 'Join VegRuit' : 'Start Selling'}</h2>
              <p>{userType === USER_TYPES.BUYER ? 'Connect with local farmers and get fresh produce' : 'Connect with local buyers and grow your business'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
