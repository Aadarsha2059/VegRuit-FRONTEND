import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI, USER_TYPES, STORAGE_KEYS } from '../services/authAPI'
import '../styles/Auth.css'

const Login = ({ onClose, onSuccess, onSwitchToSignUp }) => {
  const navigate = useNavigate()
  const [userType, setUserType] = useState(USER_TYPES.BUYER) // Default to buyer
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      let response
      if (userType === USER_TYPES.BUYER) {
        response = await authAPI.loginBuyer(formData)
      } else {
        response = await authAPI.loginSeller(formData)
      }

      if (response.success) {
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType)
        
        toast.success(`${userType === USER_TYPES.BUYER ? 'Buyer' : 'Seller'} login successful! Welcome back!`)
        onSuccess(response.user)
        
        // Redirect based on user type
        if (userType === USER_TYPES.BUYER) {
          navigate('/dashboard')
        } else {
          navigate('/seller-dashboard')
        }
      } else {
        toast.error(response.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
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
                  🛒 Buyer Login
                </button>
                <button 
                  className={`toggle-btn ${userType === USER_TYPES.SELLER ? 'active' : ''}`}
                  onClick={() => setUserType(USER_TYPES.SELLER)}
                >
                  👨‍🌾 Seller Login
                </button>
              </div>

              <h1>Welcome Back</h1>
              <p>Sign in to your {userType === USER_TYPES.BUYER ? 'buyer' : 'seller'} account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
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
                    placeholder="Enter your username"
                    required
                    className="form-input"
                  />
                </div>
              </div>

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
                    placeholder="Enter your password"
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

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <button type="button" className="forgot-link">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="auth-btn primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">⏳</span>
                ) : (
                  `Sign In as ${userType === USER_TYPES.BUYER ? 'Buyer' : 'Seller'}`
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
                Don't have an account?{' '}
                <button 
                  type="button"
                  className="auth-link"
                  onClick={() => onSwitchToSignUp(userType)}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>

          <div className="auth-image">
            <div className="image-overlay">
              <h2>{userType === USER_TYPES.BUYER ? 'Fresh Produce' : 'Local Farming'}</h2>
              <p>{userType === USER_TYPES.BUYER ? 'From local farmers to your table' : 'Connect with local buyers'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
