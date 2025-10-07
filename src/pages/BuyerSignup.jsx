import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authAPI, STORAGE_KEYS } from '../services/authAPI'
import '../components/auth/AttractiveAuth.css'

const BuyerSignup = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    address: '',
    userType: ['buyer'],
    isBuyer: true,
    isSeller: false
  })
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordStrengthText, setPasswordStrengthText] = useState('')
  const [passwordStrengthClass, setPasswordStrengthClass] = useState('')
  const navigate = useNavigate()

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
    
    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    let text = ''
    let className = ''
    
    if (password.length === 0) {
      setPasswordStrength(0)
      setPasswordStrengthText('')
      setPasswordStrengthClass('')
      return
    }
    
    // Length check
    if (password.length >= 8) strength += 1
    
    // Uppercase letter check
    if (/[A-Z]/.test(password)) strength += 1
    
    // Lowercase letter check
    if (/[a-z]/.test(password)) strength += 1
    
    // Number check
    if (/[0-9]/.test(password)) strength += 1
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    // Determine strength text and class
    if (strength <= 2) {
      text = 'Weak'
      className = 'password-strength-weak'
    } else if (strength <= 4) {
      text = 'Medium'
      className = 'password-strength-medium'
    } else {
      text = 'Strong'
      className = 'password-strength-strong'
    }
    
    setPasswordStrength(strength)
    setPasswordStrengthText(text)
    setPasswordStrengthClass(className)
  }

  const validateForm = () => {
    const newErrors = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length > 30) {
      newErrors.firstName = 'First name must be less than 30 characters'
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.length > 30) {
      newErrors.lastName = 'Last name must be less than 30 characters'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    } else if (formData.city.length > 50) {
      newErrors.city = 'City name must be less than 50 characters'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (formData.address.length > 100) {
      newErrors.address = 'Address must be less than 100 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.registerBuyer({
        username: formData.username.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        userType: ['buyer'],
        isBuyer: true,
        isSeller: false
      })

      if (response.success) {
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, JSON.stringify(response.userType))

        toast.success('Buyer account created successfully! 🎉')
        // Navigate to buyer dashboard
        navigate('/buyer-dashboard')
      } else {
        toast.error(response.message || 'Signup failed')
        if (response.field) {
          setErrors({ [response.field]: response.message })
        }
      }
    } catch (error) {
      toast.error('Signup failed. Please check your connection and try again.')
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <div className="auth-background">
          <img src="/src/assets/login_signup_images/buyer signup page.png" alt="Buyer Signup Background" className="background-image" />
          <div className="background-overlay"></div>
          <div className="decoration-element decoration-1">🛒</div>
          <div className="decoration-element decoration-2">🥕</div>
        </div>
        
        <div className="auth-content">
          {/* Back to Home Button - Positioned at top right */}
          <Link to="/" className="back-button top-right">
            <span className="back-icon">←</span>
            Back to Home
          </Link>
          
          <div className="auth-header">
            <div className="auth-logo">
              <h1>🛒 Buyer Signup</h1>
              <p>Create your shopping account</p>
            </div>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">👨</span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
              </div>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🏙️</span>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                />
              </div>
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🏠</span>
                <input
                  type="text"
                  name="address"
                  placeholder="Delivery Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                />
              </div>
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'error' : ''}
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
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
              {formData.password && (
                <div className="password-strength">
                  <div className={`password-strength-bar ${passwordStrengthClass}`}></div>
                </div>
              )}
              {passwordStrengthText && (
                <div className={`password-strength-text password-strength-${passwordStrengthText.toLowerCase()}-text`}>
                  Password Strength: {passwordStrengthText}
                </div>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group terms">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Create Buyer Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have a buyer account?
              <Link to="/buyer-login" className="login-link">
                Login as Buyer
              </Link>
            </p>
            <div className="social-login">
              <p>Or signup with</p>
              <div className="social-icons">
                <button className="social-btn google" aria-label="Signup with Google">G</button>
                <button className="social-btn facebook" aria-label="Signup with Facebook">f</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerSignup