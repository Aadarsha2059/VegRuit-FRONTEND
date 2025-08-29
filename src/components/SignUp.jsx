import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI, USER_TYPES, STORAGE_KEYS } from '../services/authAPI'
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
    city: 'Kathmandu'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.username || !formData.password || 
        !formData.confirmPassword || !formData.address || !formData.city) {
      toast.error('Please fill in all fields')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
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
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
        address: formData.address,
        city: formData.city
      }

      let response
      if (userType === USER_TYPES.BUYER) {
        response = await authAPI.registerBuyer(userData)
      } else {
        response = await authAPI.registerSeller(userData)
      }

      if (response.success) {
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType)
        
        toast.success(`${userType === USER_TYPES.BUYER ? 'Buyer' : 'Seller'} account created successfully! Welcome to VegRuit!`)
        onSuccess(response.user)
        
        // Redirect based on user type
        if (userType === USER_TYPES.BUYER) {
          navigate('/dashboard')
        } else {
          navigate('/seller-dashboard')
        }
      } else {
        toast.error(response.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
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
      <div className="auth-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <h2>VegRuit</h2>
                <p>Fresh from Kathmandu</p>
              </div>
              
              {/* User Type Toggle */}
              <div className="user-type-toggle">
                <button 
                  className={`toggle-btn ${userType === USER_TYPES.BUYER ? 'active' : ''}`}
                  onClick={() => setUserType(USER_TYPES.BUYER)}
                >
                  🛒 Buyer Sign Up
                </button>
                <button 
                  className={`toggle-btn ${userType === USER_TYPES.SELLER ? 'active' : ''}`}
                  onClick={() => setUserType(USER_TYPES.SELLER)}
                >
                  👨‍🌾 Seller Sign Up
                </button>
              </div>

              <h1>Create Account</h1>
              <p>Join VegRuit as a {userType === USER_TYPES.BUYER ? 'buyer' : 'seller'} and start your fresh produce journey</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
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
                      placeholder="First name"
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
                      placeholder="Last name"
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
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
                    placeholder="Choose a username"
                    required
                    className="form-input"
                  />
                </div>
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
                      placeholder="Create a password"
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
                      placeholder="Confirm password"
                      required
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  {userType === USER_TYPES.BUYER ? 'Delivery Address' : 'Farm Address'}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={userType === USER_TYPES.BUYER ? 'Street address, ward number' : 'Farm location, ward number'}
                    required
                    className="form-input"
                  />
                </div>
              </div>

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
                className="auth-btn primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">⏳</span>
                ) : (
                  `Create ${userType === USER_TYPES.BUYER ? 'Buyer' : 'Seller'} Account`
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
