// Auth API Service Layer for MERN stack integration
// This layer provides a clean interface for authentication operations

const API_BASE_URL = 'http://localhost:50011/api/auth'

// Authentication API functions
export const authAPI = {
  // Check if user exists and suggest user type
  async checkUserExists(username, email) {
    try {
      const params = new URLSearchParams();
      if (username) params.append('username', username);
      if (email) params.append('email', email);
      
      const response = await fetch(`${API_BASE_URL}/check-user?${params.toString()}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check user')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to check user'
      }
    }
  },

  // Buyer Login
  async loginBuyer(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
          field: data.field,
          suggestion: data.suggestion,
          existingUserType: data.existingUserType
        }
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        field: 'network'
      }
    }
  },

  // Seller Login
  async loginSeller(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
          field: data.field,
          suggestion: data.suggestion,
          existingUserType: data.existingUserType
        }
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        field: 'network'
      }
    }
  },

  // Buyer Registration
  async registerBuyer(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed',
          field: data.field,
          suggestion: data.suggestion,
          existingUserType: data.existingUserType
        }
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        field: 'network'
      }
    }
  },

  // Seller Registration
  async registerSeller(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed',
          field: data.field,
          suggestion: data.suggestion,
          existingUserType: data.existingUserType
        }
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        field: 'network'
      }
    }
  },

  // Logout
  async logout(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Logout failed'
      }
    }
  },

  // Verify Token (for maintaining login state)
  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          valid: true,
          user: data.user
        }
      } else {
        return {
          success: true,
          valid: false
        }
      }
    } catch (error) {
      return {
        success: false,
        valid: false,
        message: 'Token verification failed'
      }
    }
  },

  // Update Profile
  async updateProfile(token, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Profile update failed'
      }
    }
  }
}

// User type constants
export const USER_TYPES = {
  BUYER: 'buyer',
  SELLER: 'seller'
}

// Local storage keys
export const STORAGE_KEYS = {
  USER_DATA: 'vegruit_user',
  AUTH_TOKEN: 'vegruit_token',
  USER_TYPE: 'vegruit_user_type'
}
