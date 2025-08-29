import React, { useState } from 'react'
import Login from '../Login'
import SignUp from '../SignUp'
import { USER_TYPES } from '../../services/authAPI'

const Auth = ({ onClose, onSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [currentUserType, setCurrentUserType] = useState(USER_TYPES.BUYER)

  const handleSwitchToSignUp = (userType) => {
    setCurrentUserType(userType)
    setIsLoginMode(false)
  }

  const handleSwitchToLogin = (userType) => {
    setCurrentUserType(userType)
    setIsLoginMode(true)
  }

  const handleClose = () => {
    onClose()
  }

  const handleSuccess = (userData) => {
    onSuccess(userData)
  }

  return (
    <>
      {isLoginMode ? (
        <Login
          onClose={handleClose}
          onSuccess={handleSuccess}
          onSwitchToSignUp={handleSwitchToSignUp}
          defaultUserType={currentUserType}
        />
      ) : (
        <SignUp
          onClose={handleClose}
          onSuccess={handleSuccess}
          onSwitchToLogin={handleSwitchToLogin}
          defaultUserType={currentUserType}
        />
      )}
    </>
  )
}

export default Auth
