// Auth API Service Layer for future MERN stack integration
// This layer provides a clean interface for authentication operations

const API_BASE_URL = 'http://localhost:3001/api' // Will be used when backend is ready

// Mock data for development - will be replaced with real API calls
const mockUsers = {
  buyers: [
    {
      id: 1,
      username: 'buyer123',
      password: 'password',
      email: 'buyer@vegruit.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+977 9851234567',
      address: 'Thamel, Kathmandu',
      city: 'Kathmandu',
      userType: 'buyer'
    },
    {
      id: 2,
      username: 'aadarsha123',
      password: 'password',
      email: 'aadarsha@vegruit.com',
      firstName: 'Aadarsha',
      lastName: 'Dhakal',
      phone: '+977 9851234568',
      address: 'Baneshwor, Kathmandu',
      city: 'Kathmandu',
      userType: 'buyer'
    }
  ],
  sellers: [
    {
      id: 1,
      username: 'farmer123',
      password: 'password',
      email: 'farmer@vegruit.com',
      firstName: 'Ram',
      lastName: 'Thapa',
      phone: '+977 9841234567',
      farmName: 'Green Valley Farm',
      farmLocation: 'Bhaktapur',
      city: 'Bhaktapur',
      userType: 'seller'
    },
    {
      id: 2,
      username: 'seller123',
      password: 'password',
      email: 'seller@vegruit.com',
      firstName: 'Sita',
      lastName: 'Shrestha',
      phone: '+977 9841234568',
      farmName: 'Fresh Harvest Farm',
      farmLocation: 'Lalitpur',
      city: 'Lalitpur',
      userType: 'seller'
    }
  ]
}

// Utility function to simulate API delay
const simulateAPIDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Authentication API functions
export const authAPI = {
  // Buyer Login
  async loginBuyer(credentials) {
    await simulateAPIDelay()
    
    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/auth/buyer/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // })
      // return await response.json()

      const buyer = mockUsers.buyers.find(
        user => user.username === credentials.username && user.password === credentials.password
      )

      if (!buyer) {
        throw new Error('Invalid credentials')
      }

      const { password, ...userWithoutPassword } = buyer
      return {
        success: true,
        user: userWithoutPassword,
        token: 'mock_buyer_token_' + Date.now(),
        message: 'Buyer login successful'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      }
    }
  },

  // Seller Login
  async loginSeller(credentials) {
    await simulateAPIDelay()
    
    try {
      const seller = mockUsers.sellers.find(
        user => user.username === credentials.username && user.password === credentials.password
      )

      if (!seller) {
        throw new Error('Invalid credentials')
      }

      const { password, ...userWithoutPassword } = seller
      return {
        success: true,
        user: userWithoutPassword,
        token: 'mock_seller_token_' + Date.now(),
        message: 'Seller login successful'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      }
    }
  },

  // Buyer Registration
  async registerBuyer(userData) {
    await simulateAPIDelay(1500)
    
    try {
      // Check if username already exists
      const existingBuyer = mockUsers.buyers.find(user => user.username === userData.username)
      if (existingBuyer) {
        throw new Error('Username already exists')
      }

      const newBuyer = {
        id: mockUsers.buyers.length + 1,
        ...userData,
        userType: 'buyer',
        createdAt: new Date().toISOString()
      }

      mockUsers.buyers.push(newBuyer)
      
      const { password, ...userWithoutPassword } = newBuyer
      return {
        success: true,
        user: userWithoutPassword,
        token: 'mock_buyer_token_' + Date.now(),
        message: 'Buyer registration successful'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      }
    }
  },

  // Seller Registration
  async registerSeller(userData) {
    await simulateAPIDelay(1500)
    
    try {
      // Check if username already exists
      const existingSeller = mockUsers.sellers.find(user => user.username === userData.username)
      if (existingSeller) {
        throw new Error('Username already exists')
      }

      const newSeller = {
        id: mockUsers.sellers.length + 1,
        ...userData,
        userType: 'seller',
        createdAt: new Date().toISOString()
      }

      mockUsers.sellers.push(newSeller)
      
      const { password, ...userWithoutPassword } = newSeller
      return {
        success: true,
        user: userWithoutPassword,
        token: 'mock_seller_token_' + Date.now(),
        message: 'Seller registration successful'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      }
    }
  },

  // Logout
  async logout() {
    await simulateAPIDelay(500)
    
    try {
      // In production, this would invalidate the token on the server
      return {
        success: true,
        message: 'Logout successful'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Logout failed'
      }
    }
  },

  // Verify Token (for maintaining login state)
  async verifyToken(token) {
    await simulateAPIDelay(300)
    
    try {
      // In production, this would verify the JWT token with the server
      if (token && token.startsWith('mock_')) {
        return {
          success: true,
          valid: true
        }
      }
      
      return {
        success: true,
        valid: false
      }
    } catch (error) {
      return {
        success: false,
        valid: false,
        message: 'Token verification failed'
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
