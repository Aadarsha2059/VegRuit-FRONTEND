import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI, USER_TYPES, STORAGE_KEYS } from '../services/authAPI'
import { navigateToDashboard, getUserTypeDisplayName } from '../utils/navigation'
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
  const [userTypeSuggestion, setUserTypeSuggestion] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isCheckingUser, setIsCheckingUser] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear field errors when user types
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: null
      })
    }
    
    // Clear user type suggestion when user types
    if (userTypeSuggestion) {
      setUserTypeSuggestion(null)
    }
  }

  const checkUserType = async (username) => {
    if (username.length < 3) {
      setUserTypeSuggestion(null)
      return
    }
    
    setIsCheckingUser(true)
    try {
      const result = await authAPI.checkUserExists(username, username.includes('@') ? username : null)
      if (result.success && result.exists) {
        setUserTypeSuggestion({
          suggestedType: result.userType,
          message: result.message,
          suggestion: result.suggestion
        })
        
        // Auto-switch to correct user type if different
        if (result.userType !== userType) {
          setTimeout(() => {
            toast.info(`💡 This account is registered as a ${getUserTypeDisplayName(result.userType)}`)
          }, 500)
        }
      } else {
        setUserTypeSuggestion(null)
      }
    } catch (error) {
      // Silently handle errors for user type checking
      setUserTypeSuggestion(null)
    } finally {
      setIsCheckingUser(false)
    }
  }

  const handleUsernameBlur = () => {
    if (formData.username) {
      checkUserType(formData.username)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.username.trim()) {
      errors.username = 'Username or email is required'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      // Use the universal login endpoint
      const response = await authAPI.loginBuyer(formData) // This actually calls the universal login

      if (response.success) {
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, response.userType || response.user.userType)
        
        const actualUserType = response.userType || response.user.userType
        
        // Show success message
        toast.success(`🎉 ${response.message}`, {
          duration: 2000,
          icon: '✅'
        })
        
        // Update user object with userType to ensure consistency
        const userWithType = { ...response.user, userType: actualUserType }
        onSuccess(userWithType)
        
        // Redirect based on actual user type from backend
        setTimeout(() => {
          toast.success(`🚀 Redirecting to your ${getUserTypeDisplayName(actualUserType)} dashboard...`)
          setTimeout(() => {
            navigateToDashboard(navigate, actualUserType)
          }, 1000)
        }, 1500)
      } else {
        // Handle specific error cases with better UX
        if (response.field === 'username') {
          setFieldErrors({ username: response.message })
          toast.error(`❌ ${response.message}`)
          if (response.suggestion) {
            setTimeout(() => toast.error(`💡 ${response.suggestion}`), 1000)
          }
        } else if (response.field === 'password') {
          setFieldErrors({ password: response.message })
          toast.error(`❌ ${response.message}`)
          if (response.suggestion) {
            setTimeout(() => toast.error(`💡 ${response.suggestion}`), 1000)
          }
        } else {
          toast.error(`❌ ${response.message || 'Login failed. Please try again.'}`)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
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

  const handleUserTypeChange = (newUserType) => {
    setUserType(newUserType)
    setUserTypeSuggestion(null) // Clear suggestion when user changes type
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
                <h2>🥬 VegRuit</h2>
                <p>Fresh from Kathmandu Valley</p>
              </div>
              
              {/* User Type Toggle */}
              <div className="user-type-toggle">
                <button 
                  className={`toggle-btn ${userType === USER_TYPES.BUYER ? 'active' : ''}`}
                  onClick={() => handleUserTypeChange(USER_TYPES.BUYER)}
                  disabled={isLoading}
                >
                  <span className="toggle-icon">🛒</span>
                  <span className="toggle-text">Buyer Login</span>
                </button>
                <button 
                  className={`toggle-btn ${userType === USER_TYPES.SELLER ? 'active' : ''}`}
                  onClick={() => handleUserTypeChange(USER_TYPES.SELLER)}
                  disabled={isLoading}
                >
                  <span className="toggle-icon">👨‍🌾</span>
                  <span className="toggle-text">Seller Login</span>
                </button>
              </div>

              <h1>Welcome Back! 👋</h1>
              <p>Sign in to your {userType === USER_TYPES.BUYER ? 'buyer' : 'seller'} account and continue your fresh produce journey</p>
            </div>

            {/* User Type Suggestion */}
            {userTypeSuggestion && (
              <div className={`user-type-suggestion ${userTypeSuggestion.suggestedType === userType ? 'correct' : 'incorrect'}`}>
                <p>{userTypeSuggestion.message}</p>
                {userTypeSuggestion.suggestedType !== userType && (
                  <button 
                    className="suggestion-btn"
                    onClick={() => handleUserTypeChange(userTypeSuggestion.suggestedType)}
                  >
                    Switch to {userTypeSuggestion.suggestedType === USER_TYPES.BUYER ? 'Buyer' : 'Seller'} Login
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">
                  <span className="label-text">Username or Email</span>
                  <span className="label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleUsernameBlur}
                    placeholder="Enter your username or email"
                    required
                    disabled={isLoading}
                    className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                  />
                  {isCheckingUser && <span className="checking-indicator">⏳</span>}
                </div>
                {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-text">Password</span>
                  <span className="label-required">*</span>
                </label>
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
                    disabled={isLoading}
                    className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input type="checkbox" disabled={isLoading} />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Remember me for 7 days</span>
                </label>
                <button type="button" className="forgot-link" disabled={isLoading}>
                  Forgot password? 🔑
                </button>
              </div>

              <button
                type="submit"
                className={`auth-btn primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">{userType === USER_TYPES.BUYER ? '🛒' : '👨‍🌾'}</span>
                    <span>Sign In as {userType === USER_TYPES.BUYER ? 'Buyer' : 'Seller'}</span>
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
