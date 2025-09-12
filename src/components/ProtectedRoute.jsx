import React from 'react'
import { Navigate } from 'react-router-dom'
import { hasRouteAccess } from '../utils/navigation'

const ProtectedRoute = ({ children, user, requiredUserType, redirectTo = '/' }) => {
  // Check if user is authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  // Check if user has the required user type
  if (requiredUserType && user.userType !== requiredUserType) {
    // Redirect to appropriate dashboard if user is authenticated but wrong type
    if (user.userType === 'buyer') {
      return <Navigate to="/buyer-dashboard" replace />
    } else if (user.userType === 'seller') {
      return <Navigate to="/seller-dashboard" replace />
    }
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default ProtectedRoute