const API_BASE_URL = 'http://localhost:5001/api/categories'

// Category API functions
export const categoryAPI = {
  // Get public categories (for buyers)
  async getPublicCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/public`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories')
      }
      
      return data
    } catch (error) {
      console.error('Get public categories error:', error);
      // Check if it's a connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch categories'
      }
    }
  },

  // Get seller's categories
  async getSellerCategories(token) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch categories'
      }
    }
  },

  // Create category
  async createCategory(token, categoryData) {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      
      // Don't set Content-Type for FormData, let browser set it with boundary
      let body
      if (categoryData instanceof FormData) {
        body = categoryData
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(categoryData)
      }

      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers,
        body
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create category')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create category'
      }
    }
  },

  // Update category
  async updateCategory(token, categoryId, categoryData) {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      
      // Don't set Content-Type for FormData, let browser set it with boundary
      let body
      if (categoryData instanceof FormData) {
        body = categoryData
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(categoryData)
      }

      const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
        method: 'PUT',
        headers,
        body
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update category')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update category'
      }
    }
  },

  // Delete category
  async deleteCategory(token, categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete category')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete category'
      }
    }
  },

  // Get category statistics
  async getCategoryStats(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category statistics')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch category statistics'
      }
    }
  }
}