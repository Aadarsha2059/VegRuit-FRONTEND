const API_BASE_URL = 'http://localhost:50011/api/categories'

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
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
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
      const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
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