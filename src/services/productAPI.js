const API_BASE_URL = 'http://localhost:50011/api/products'

// Product API functions
export const productAPI = {
  // Get public products (for buyers)
  async getPublicProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key])
        }
      })
      
      const response = await fetch(`${API_BASE_URL}/public?${queryParams.toString()}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch products'
      }
    }
  },

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await fetch(`${API_BASE_URL}/featured?limit=${limit}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch featured products')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch featured products'
      }
    }
  },

  // Get single product
  async getProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch product'
      }
    }
  },

  // Get seller's products
  async getSellerProducts(token, params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key])
        }
      })
      
      const response = await fetch(`${API_BASE_URL}/seller/all?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch products'
      }
    }
  },

  // Create product
  async createProduct(token, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create product'
      }
    }
  },

  // Update product
  async updateProduct(token, productId, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update product'
      }
    }
  },

  // Delete product
  async deleteProduct(token, productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete product'
      }
    }
  },

  // Get product statistics
  async getProductStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product statistics')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch product statistics'
      }
    }
  }
}