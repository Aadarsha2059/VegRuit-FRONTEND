import React, { useState } from 'react'
import BuyerLogin from './BuyerLogin'
import SellerLogin from './SellerLogin'
import AttractiveAuth from './AttractiveAuth'

const MainAuth = ({ onAuthSuccess, onClose, initialAuthMode = 'login', initialUserType = 'buyer' }) => {
  const [authMode, setAuthMode] = useState(initialAuthMode) // 'login' or 'signup'
  const [loginType, setLoginType] = useState(initialUserType) // 'buyer' or 'seller'

  const handleAuthSuccess = (userData) => {
    // Close the modal first
    onClose()
    
    // Navigate to appropriate dashboard based on user roles
    if (userData.isBuyer && userData.isSeller) {
      // User can be both - default to buyer dashboard
      setTimeout(() => {
        window.location.href = '/buyer-dashboard'
      }, 500)
    } else if (userData.isBuyer) {
      setTimeout(() => {
        window.location.href = '/buyer-dashboard'
      }, 500)
    } else if (userData.isSeller) {
      setTimeout(() => {
        window.location.href = '/seller-dashboard'
      }, 500)
    }
    
    // Call the success callback
    onAuthSuccess(userData)
  }

  const handleSwitchToSeller = () => {
    setLoginType('seller')
  }

  const handleSwitchToBuyer = () => {
    setLoginType('buyer')
  }

  const handleSwitchToSignup = () => {
    setAuthMode('signup')
  }

  const handleSwitchToLogin = () => {
    setAuthMode('login')
  }

  // If signup mode, show the attractive auth component
  if (authMode === 'signup') {
    return (
      <AttractiveAuth 
        onAuthSuccess={handleAuthSuccess}
        onClose={onClose}
      />
    )
  }

  // If login mode, show appropriate login component
  if (loginType === 'buyer') {
    return (
      <BuyerLogin 
        onAuthSuccess={handleAuthSuccess}
        onClose={onClose}
        onSwitchToSeller={handleSwitchToSeller}
      />
    )
  }

  return (
    <SellerLogin 
      onAuthSuccess={handleAuthSuccess}
      onClose={onClose}
      onSwitchToBuyer={handleSwitchToBuyer}
    />
  )
}

export default MainAuth