const API_BASE_URL = 'http://localhost:50011/api/orders'

// Order API functions
export const orderAPI = {
  // Create order
  async createOrder(token, orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Order creation failed:', data);
        throw new Error(data.message || `Failed to create order. Server responded with status ${response.status}`);
      }
      
      return data
    } catch (error) {
      console.error('Order creation error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running and try again.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to create order. Please check your network connection and try again.'
      }
    }
  },

  // Get buyer orders
  async getBuyerOrders(token, params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key])
        }
      })
      
      const response = await fetch(`${API_BASE_URL}/buyer?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders')
      }
      
      return data
    } catch (error) {
      console.error('Get buyer orders error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch orders'
      }
    }
  },

  // Get seller orders
  async getSellerOrders(token, params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key])
        }
      })
      
      const response = await fetch(`${API_BASE_URL}/seller?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders')
      }
      
      return data
    } catch (error) {
      console.error('Get seller orders error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch orders'
      }
    }
  },

  // Get single order
  async getOrder(token, orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch order')
      }
      
      return data
    } catch (error) {
      console.error('Get order error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch order'
      }
    }
  },

  // Accept order (seller only)
  async acceptOrder(token, orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${orderId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept order')
      }
      
      return data
    } catch (error) {
      console.error('Accept order error:', error);
      return {
        success: false,
        message: error.message || 'Failed to accept order'
      }
    }
  },

  // Reject order (seller only)
  async rejectOrder(token, orderId, reason = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/${orderId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject order')
      }
      
      return data
    } catch (error) {
      console.error('Reject order error:', error);
      return {
        success: false,
        message: error.message || 'Failed to reject order'
      }
    }
  },

  // Update order status (seller only)
  async updateOrderStatus(token, orderId, status, reason = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status')
      }
      
      return data
    } catch (error) {
      console.error('Update order status error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to update order status'
      }
    }
  },

  // Cancel order (buyer only)
  async cancelOrder(token, orderId, reason = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel order')
      }
      
      return data
    } catch (error) {
      console.error('Cancel order error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to cancel order'
      }
    }
  },

  // Get order statistics
  async getOrderStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch order statistics')
      }
      
      return data
    } catch (error) {
      console.error('Get order stats error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch order statistics'
      }
    }
  }
}