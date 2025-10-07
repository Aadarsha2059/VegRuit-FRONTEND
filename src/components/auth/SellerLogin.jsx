import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { STORAGE_KEYS } from '../../services/authAPI'
import './SellerLogin.css'

const SellerLogin = ({ onAuthSuccess, onClose, onSwitchToBuyer }) => {
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForgotPasswordForm = () => {
    const newErrors = {}

    if (!forgotPasswordData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(forgotPasswordData.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Check if user is a seller
        if (!data.user.isSeller) {
          toast.error('This account is not registered as a seller. Please use buyer login.')
          return
        }

        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, JSON.stringify(data.userType))

        toast.success(`Welcome back, ${data.user.firstName}! 🌾`)
        onAuthSuccess(data.user)
      } else {
        toast.error(data.message || 'Login failed')
        if (data.field) {
          setErrors({ [data.field]: data.message })
        }
      }
    } catch (error) {
      toast.error('Login failed. Please check your connection and try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    
    if (!validateForgotPasswordForm()) {
      toast.error('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      // Simulate forgot password API call
      setTimeout(() => {
        toast.success('Password reset instructions sent to your email!')
        setShowForgotPassword(false)
        setLoading(false)
      }, 1000)
    } catch (error) {
      toast.error('Failed to send password reset instructions')
      console.error('Forgot password error:', error)
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="seller-login-overlay">
        <div className="seller-login-container">
          <div className="login-background">
            <img src="/src/assets/login_signup_images/seller login page.png" alt="Seller Login Background" className="background-image" />
            <div className="background-overlay"></div>
          </div>
          
          <div className="login-content">
            <div className="login-header">
              <button className="close-btn" onClick={onClose}>
                <span>×</span>
              </button>
              <div className="login-logo">
                <h1>🌾 Reset Password</h1>
                <p>Enter your email to reset your password</p>
              </div>
            </div>

            <form onSubmit={handleForgotPassword} className="login-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
              
              <div className="form-footer">
                <button 
                  type="button" 
                  className="link-btn"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="seller-login-overlay">
      <div className="seller-login-container">
        <div className="login-background">
          <img src="/src/assets/login_signup_images/seller login page.png" alt="Seller Login Background" className="background-image" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="login-content">
          <div className="login-header">
            <button className="close-btn" onClick={onClose}>
              <span>×</span>
            </button>
            <div className="login-logo">
              <h1>🌾 Seller Login</h1>
              <p>Access your farm dashboard</p>
            </div>
          </div>

          <div className="login-switch">
            <button className="switch-btn" onClick={onSwitchToBuyer}>Buyer Login</button>
            <button className="switch-btn active">Seller Login</button>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Username or Email"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'error' : ''}
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                className="forgot-password"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Login as Seller'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have a seller account?
              <button 
                className="signup-link" 
                onClick={() => {
                  // Switch to signup mode
                  window.location.href = '/auth'
                }}
              >
                Sign Up as Seller
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerLogin