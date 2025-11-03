const API_BASE_URL = 'http://localhost:50011/api/cart'

// Cart API functions
export const cartAPI = {
  // Get cart
  async getCart(token) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cart')
      }
      
      return data
    } catch (error) {
      console.error('Get cart error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch cart'
      }
    }
  },

  // Add to cart
  async addToCart(token, productId, quantity = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add item to cart'
      }
    }
  },

  // Update cart item quantity
  async updateCartItem(token, productId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/item/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart item')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update cart item'
      }
    }
  },

  // Remove from cart
  async removeFromCart(token, productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/item/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item from cart')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to remove item from cart'
      }
    }
  },

  // Clear cart
  async clearCart(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear cart')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to clear cart'
      }
    }
  },

  // Get cart count
  async getCartCount(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cart count')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch cart count'
      }
    }
  }
}
