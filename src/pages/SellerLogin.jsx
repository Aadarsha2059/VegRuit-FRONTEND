import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI, STORAGE_KEYS } from '../services/authAPI'
import '../components/auth/SellerLogin.css'

const SellerLogin = () => {
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
  const navigate = useNavigate()
  const usernameRef = useRef(null)

  // Focus on username field when component mounts
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus()
    }
  }, [])

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
      const response = await authAPI.loginSeller({
        username: formData.username.trim(),
        password: formData.password
      })

      if (response.success) {
        // Check if user is a seller
        if (!response.user.isSeller) {
          toast.error('This account is not registered as a seller. Please use buyer login.')
          setLoading(false)
          return
        }

        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, JSON.stringify(response.userType))

        toast.success(`Welcome back, ${response.user.firstName}! 🌾`)
        // Navigate to seller dashboard
        navigate('/seller-dashboard')
      } else {
        toast.error(response.message || 'Login failed')
        if (response.field) {
          setErrors({ [response.field]: response.message })
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
      // In a real application, you would call the API here
      // For now, we'll simulate a successful request
      setTimeout(() => {
        toast.success('Password reset instructions sent to your email!')
        setShowForgotPassword(false)
        setLoading(false)
        setForgotPasswordData({ email: '' })
      }, 1500)
    } catch (error) {
      toast.error('Failed to send password reset instructions')
      console.error('Forgot password error:', error)
      setLoading(false)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      if (e.target.name === 'username') {
        // Focus on password field
        e.preventDefault()
        const passwordField = document.querySelector('input[name="password"]')
        if (passwordField) {
          passwordField.focus()
        }
      } else if (e.target.name === 'password') {
        // Submit form
        e.preventDefault()
        handleLogin(e)
      }
    }
  }

  if (showForgotPassword) {
    return (
      <div className="seller-login-overlay">
        <div className="seller-login-container">
          <div className="login-background">
            <img src="/src/assets/login_signup_images/seller login page.png" alt="Seller Login Background" className="background-image" />
            <div className="background-overlay"></div>
            <div className="decoration-element decoration-1">🌾</div>
            <div className="decoration-element decoration-2">🚜</div>
          </div>
          
          <div className="login-content">
            {/* Back to Home Button - Positioned at top right */}
            <Link to="/" className="back-button top-right">
              <span className="back-icon">←</span>
              Back to Home
            </Link>
            
            <div className="login-header">
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
                  onClick={() => {
                    setShowForgotPassword(false)
                    setErrors({})
                  }}
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
          <div className="decoration-element decoration-1">🌾</div>
          <div className="decoration-element decoration-2">🚜</div>
        </div>
        
        <div className="login-content">
          {/* Back to Home Button - Positioned at top right */}
          <Link to="/" className="back-button top-right">
            <span className="back-icon">←</span>
            Back to Home
          </Link>
          
          <div className="login-header">
            <div className="login-logo">
              <h1>🌾 Seller Login</h1>
              <p>Access your farm dashboard</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  ref={usernameRef}
                  type="text"
                  name="username"
                  placeholder="Username or Email"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
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
                  onKeyDown={handleKeyDown}
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
              <Link to="/seller-signup" className="signup-link">
                Sign Up as Seller
              </Link>
            </p>
            <div className="social-login">
              <p>Or login with</p>
              <div className="social-icons">
                <button className="social-btn google" aria-label="Login with Google">G</button>
                <button className="social-btn facebook" aria-label="Login with Facebook">f</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerLogin