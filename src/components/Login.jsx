import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import '../styles/Auth.css'

const Login = ({ onClose, onSuccess, onSwitchToSignUp }) => {
  const navigate = useNavigate()
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check credentials (hardcoded for demo)
      if (formData.username === 'aadarsha123' && formData.password === 'password') {
        // Store user data in localStorage
        const userData = {
          username: formData.username,
          name: 'Aadarsha Babu Dhakal',
          email: 'aadarsha@vegruit.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('vegruit_user', JSON.stringify(userData))
        
        toast.success('Login successful! Welcome back!')
        onSuccess(userData)
        navigate('/dashboard')
      } else {
        toast.error('Invalid credentials. Please try again.')
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
              <h1>Welcome Back</h1>
              <p>Sign in to your account to continue shopping</p>
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
                  'Sign In'
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
                  onClick={onSwitchToSignUp}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>

          <div className="auth-image">
            <div className="image-overlay">
              <h2>Fresh Produce</h2>
              <p>From local farmers to your table</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
