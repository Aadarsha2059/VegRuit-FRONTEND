// Navigation utilities for user authentication

import { USER_TYPES } from '../services/authAPI'

/**
 * Get the appropriate dashboard route based on user type
 * @param {string} userType - The user type ('buyer' or 'seller')
 * @returns {string} - The dashboard route
 */
export const getDashboardRoute = (userType) => {
  switch (userType) {
    case USER_TYPES.BUYER:
      return '/buyer-dashboard'
    case USER_TYPES.SELLER:
      return '/seller-dashboard'
    default:
      return '/'
  }
}

/**
 * Navigate to the appropriate dashboard based on user type
 * @param {function} navigate - React Router navigate function
 * @param {string} userType - The user type ('buyer' or 'seller')
 */
export const navigateToDashboard = (navigate, userType) => {
  const route = getDashboardRoute(userType)
  navigate(route)
}

/**
 * Check if user has access to a specific route
 * @param {object} user - User object
 * @param {string} route - Route to check
 * @returns {boolean} - Whether user has access
 */
export const hasRouteAccess = (user, route) => {
  if (!user) return false
  
  switch (route) {
    case '/buyer-dashboard':
      return user.userType === USER_TYPES.BUYER
    case '/seller-dashboard':
      return user.userType === USER_TYPES.SELLER
    default:
      return true
  }
}

/**
 * Get user type display name
 * @param {string} userType - The user type
 * @returns {string} - Display name
 */
export const getUserTypeDisplayName = (userType) => {
  switch (userType) {
    case USER_TYPES.BUYER:
      return 'Buyer'
    case USER_TYPES.SELLER:
      return 'Seller'
    default:
      return 'User'
  }
}