import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import '../styles/Auth.css'

const SignUp = () => {
  const navigate = useNavigate()
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
    acceptTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const cities = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kirtipur', 'Thimi', 'Madhyapur Thimi',
    'Tokha', 'Suryabinayak', 'Changunarayan', 'Nagarkot', 'Banepa', 'Panauti'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your full name')
      return false
    }
    if (!formData.email) {
      toast.error('Please enter your email address')
      return false
    }
    if (!formData.phone) {
      toast.error('Please enter your phone number')
      return false
    }
    if (!formData.username) {
      toast.error('Please choose a username')
      return false
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (!formData.acceptTerms) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Store user data in localStorage (simulating successful registration)
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        address: formData.address,
        city: formData.city,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isAuthenticated: true,
        registrationTime: new Date().toISOString(),
        orders: [],
        favorites: []
      }
      
      localStorage.setItem('vegruit_user', JSON.stringify(userData))
      
      toast.success('Account created successfully! Welcome to VegRuit!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card signup">
        <div className="auth-header">
          <div className="auth-logo">
            <h2>VegRuit</h2>
            <p>Fresh from Kathmandu</p>
          </div>
          <h1>Create Account</h1>
          <p>Join VegRuit and start your fresh produce journey</p>
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
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
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
              <label htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📞</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 98XXXXXXX"
                  required
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
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
                  placeholder="Create password"
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
            <label htmlFor="address">Delivery Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📍</span>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, ward number"
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
                className="form-input"
                required
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
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              <span className="checkmark"></span>
              I agree to the{' '}
              <Link to="/terms" className="terms-link">Terms & Conditions</Link>
              {' '}and{' '}
              <Link to="/privacy" className="terms-link">Privacy Policy</Link>
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
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-auth">
          <button className="social-btn google">
            <span>🔍</span>
            Sign up with Google
          </button>
          <button className="social-btn facebook">
            <span>📘</span>
            Sign up with Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-image">
        <div className="image-overlay">
          <h2>Join VegRuit</h2>
          <p>Connect with local farmers and get fresh produce</p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
