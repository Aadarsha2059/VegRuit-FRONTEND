import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { authAPI, STORAGE_KEYS } from '../../services/authAPI'
import './AttractiveAuth.css'

const AttractiveAuth = ({ onAuthSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState('buyer') // 'buyer', 'seller', 'both'
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
    farmName: '',
    farmLocation: ''
  })
  const [errors, setErrors] = useState({})

  // Reset form when switching between login/signup
  useEffect(() => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      address: '',
      farmName: '',
      farmLocation: ''
    })
    setErrors({})
  }, [isLogin])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters'
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters'
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number'
      }

      if (!formData.city.trim()) {
        newErrors.city = 'City is required'
      } else if (formData.city.trim().length < 2) {
        newErrors.city = 'City must be at least 2 characters'
      }

      if (userType === 'buyer' || userType === 'both') {
        if (!formData.address.trim()) {
          newErrors.address = 'Address is required for buyers'
        } else if (formData.address.trim().length < 10) {
          newErrors.address = 'Address must be at least 10 characters'
        }
      }

      if (userType === 'seller' || userType === 'both') {
        if (!formData.farmName.trim()) {
          newErrors.farmName = 'Farm name is required for sellers'
        } else if (formData.farmName.trim().length < 3) {
          newErrors.farmName = 'Farm name must be at least 3 characters'
        }
        if (!formData.farmLocation.trim()) {
          newErrors.farmLocation = 'Farm location is required for sellers'
        } else if (formData.farmLocation.trim().length < 5) {
          newErrors.farmLocation = 'Farm location must be at least 5 characters'
        }
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

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
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, JSON.stringify(data.userType))

        toast.success(data.message)
        onAuthSuccess(data.user)
      } else {
        toast.error(data.message || 'Login failed')
        if (data.field) {
          setErrors({ [data.field]: data.message })
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        userType: userType === 'both' ? ['buyer', 'seller'] : [userType],
        isBuyer: userType === 'buyer' || userType === 'both',
        isSeller: userType === 'seller' || userType === 'both'
      }

      // Add role-specific fields
      if (userType === 'buyer' || userType === 'both') {
        userData.address = formData.address.trim()
      }
      if (userType === 'seller' || userType === 'both') {
        userData.farmName = formData.farmName.trim()
        userData.farmLocation = formData.farmLocation.trim()
      }

      // Use the unified register endpoint
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store user data and token
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, JSON.stringify(data.userType))

        toast.success(data.message)
        onAuthSuccess(data.user)
      } else {
        toast.error(data.message || 'Registration failed')
        if (data.field) {
          setErrors({ [data.field]: data.message })
        }
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBackgroundImage = () => {
    if (isLogin) {
      return userType === 'buyer' 
        ? '/src/assets/login_signup_images/buyer login page.png'
        : '/src/assets/login_signup_images/seller login page.png'
    } else {
      return userType === 'buyer'
        ? '/src/assets/login_signup_images/buyer sign up page.png'
        : '/src/assets/login_signup_images/seller sign up page.png'
    }
  }

  return (
    <div className="attractive-auth-overlay">
      <div className="attractive-auth-container">
        <div className="auth-background">
          <img src={getBackgroundImage()} alt="Auth Background" className="background-image" />
          <div className="background-overlay"></div>
        </div>
        
        <div className="auth-content">
          <div className="auth-header">
            <button className="close-btn" onClick={onClose}>
              <span>×</span>
            </button>
            <div className="auth-logo">
              <h1>🌱 VegRuit</h1>
              <p>Fresh from Farm to Table</p>
            </div>
          </div>

          <div className="auth-tabs">
            <button 
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {!isLogin && (
            <div className="user-type-selector">
              <h3>Choose Your Role</h3>
              <div className="role-options">
                <button 
                  className={`role-btn ${userType === 'buyer' ? 'active' : ''}`}
                  onClick={() => setUserType('buyer')}
                >
                  <span className="role-icon">🛒</span>
                  <div className="role-info">
                    <h4>Buyer</h4>
                    <p>Shop fresh produce</p>
                  </div>
                </button>
                <button 
                  className={`role-btn ${userType === 'seller' ? 'active' : ''}`}
                  onClick={() => setUserType('seller')}
                >
                  <span className="role-icon">🌾</span>
                  <div className="role-info">
                    <h4>Seller</h4>
                    <p>Sell your produce</p>
                  </div>
                </button>
                <button 
                  className={`role-btn ${userType === 'both' ? 'active' : ''}`}
                  onClick={() => setUserType('both')}
                >
                  <span className="role-icon">🔄</span>
                  <div className="role-info">
                    <h4>Both</h4>
                    <p>Buy & sell</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="auth-form">
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

            {!isLogin && (
              <>
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
                      <span className="input-icon">👤</span>
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

                <div className="form-row">
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
                </div>

                {(userType === 'buyer' || userType === 'both') && (
                  <div className="form-group">
                    <div className="input-wrapper">
                      <span className="input-icon">📍</span>
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
                )}

                {(userType === 'seller' || userType === 'both') && (
                  <>
                    <div className="form-group">
                      <div className="input-wrapper">
                        <span className="input-icon">🏡</span>
                        <input
                          type="text"
                          name="farmName"
                          placeholder="Farm Name"
                          value={formData.farmName}
                          onChange={handleInputChange}
                          className={errors.farmName ? 'error' : ''}
                        />
                      </div>
                      {errors.farmName && <span className="error-text">{errors.farmName}</span>}
                    </div>

                    <div className="form-group">
                      <div className="input-wrapper">
                        <span className="input-icon">🌍</span>
                        <input
                          type="text"
                          name="farmLocation"
                          placeholder="Farm Location"
                          value={formData.farmLocation}
                          onChange={handleInputChange}
                          className={errors.farmLocation ? 'error' : ''}
                        />
                      </div>
                      {errors.farmLocation && <span className="error-text">{errors.farmLocation}</span>}
                    </div>
                  </>
                )}
              </>
            )}

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

            {!isLogin && (
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
            )}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? 'Login' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                className="switch-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttractiveAuth