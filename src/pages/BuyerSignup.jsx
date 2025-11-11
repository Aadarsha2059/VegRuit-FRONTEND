import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/authAPI';
import AttractiveAuth from '../components/auth/AttractiveAuth';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCity, FaShoppingCart } from 'react-icons/fa';
import BackgroundAnimation from '../components/BackgroundAnimation';
import '../styles/AuthPages.css';

const BuyerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's a valid Nepali phone number (10 digits starting with 9)
    return /^9\d{9}$/.test(cleaned);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Nepali phone number starting with 9';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    setLoading(true);
    try {
      const signupData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        isBuyer: true,
        isSeller: false
      };
      const response = await authAPI.registerBuyer(signupData);
      if (response.success) {
        toast.success('Account created successfully! Welcome to TarkariShop!');
        // Navigate to buyer login page instead of dashboard
        navigate('/buyer-login');
      } else {
        toast.error(response.message || 'Registration failed');
        if (response.field && response.field !== 'server') {
          setErrors({ [response.field]: response.message });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <BackgroundAnimation />
      <AttractiveAuth title="Create Your Account" subtitle="Join Vegruit and start shopping fresh produce" icon={<FaShoppingCart />} role="buyer">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="John"
              />
            </div>
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="johndoe123"
            />
          </div>
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="john.doe@example.com"
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="98XXXXXXXX"
              className={errors.phone ? 'error' : ''}
            />
          </div>
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <div className="input-with-icon">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="e.g., Thamel, Kathmandu"
            />
          </div>
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="city">City</label>
          <div className="input-with-icon">
            <FaCity className="input-icon" />
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
              placeholder="e.g., Kathmandu"
            />
          </div>
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon password-input">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Min. 6 characters"
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-with-icon password-input">
            <FaLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
        
        <button type="submit" className="submit-btn buyer-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/buyer-login" className="buyer-link">Sign in</Link>
          </p>
          <p className="role-switch">
            Want to sell produce? <Link to="/seller-signup" className="seller-link">Create Seller Account</Link>
          </p>
        </div>
      </form>
    </AttractiveAuth>
    </>
  );
};

export default BuyerSignup;