import React from 'react'
import { Navigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../services/authAPI'

const ProtectedRoute = ({ children, requiredUserType, redirectTo = '/' }) => {
  // Get user data from localStorage
  const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  const user = userDataStr ? JSON.parse(userDataStr) : null;
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  // Check if user is authenticated
  if (!user || !token) {
    return <Navigate to={redirectTo} replace />
  }

  // Check if user has the required user type
  if (requiredUserType) {
    // Handle both array and string user types
    const userTypes = Array.isArray(user.userType) ? user.userType : [user.userType]
    const hasRequiredType = userTypes.includes(requiredUserType)
    
    if (!hasRequiredType) {
      // Redirect to appropriate dashboard based on user's available roles
      if (user.isBuyer) {
        return <Navigate to="/buyer-dashboard" replace />
      } else if (user.isSeller) {
        return <Navigate to="/seller-dashboard" replace />
      }
      return <Navigate to={redirectTo} replace />
    }
  }

  return children
}

export default ProtectedRoute