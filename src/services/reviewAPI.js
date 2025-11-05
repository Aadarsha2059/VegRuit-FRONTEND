const API_BASE_URL = 'http://localhost:5001/api/reviews'

// Review API functions
export const reviewAPI = {
  // Get reviews for a product (public)
  async getProductReviews(productId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/product/${productId}?${queryParams}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews')
      }
      
      return data
    } catch (error) {
      console.error('Get product reviews error:', error)
      return {
        success: false,
        message: error.message || 'Failed to fetch reviews'
      }
    }
  },

  // Get buyer's reviews
  async getBuyerReviews(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/buyer/my-reviews?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch your reviews')
      }
      
      return data
    } catch (error) {
      console.error('Get buyer reviews error:', error)
      return {
        success: false,
        message: error.message || 'Failed to fetch your reviews'
      }
    }
  },

  // Get reviewable products for buyer
  async getReviewableProducts(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/reviewable`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviewable products')
      }
      
      return data
    } catch (error) {
      console.error('Get reviewable products error:', error)
      return {
        success: false,
        message: error.message || 'Failed to fetch reviewable products'
      }
    }
  },

  // Get seller's received reviews
  async getSellerReviews(token, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/seller/received?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews')
      }
      
      return data
    } catch (error) {
      console.error('Get seller reviews error:', error)
      return {
        success: false,
        message: error.message || 'Failed to fetch reviews'
      }
    }
  },

  // Create a review
  async createReview(token, reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review')
      }
      
      return data
    } catch (error) {
      console.error('Create review error:', error)
      return {
        success: false,
        message: error.message || 'Failed to submit review'
      }
    }
  },

  // Update a review
  async updateReview(token, reviewId, reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update review')
      }
      
      return data
    } catch (error) {
      console.error('Update review error:', error)
      return {
        success: false,
        message: error.message || 'Failed to update review'
      }
    }
  },

  // Delete a review
  async deleteReview(token, reviewId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete review')
      }
      
      return data
    } catch (error) {
      console.error('Delete review error:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete review'
      }
    }
  },

  // Vote on review helpfulness
  async voteReview(token, reviewId, helpful) {
    try {
      const response = await fetch(`${API_BASE_URL}/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ helpful })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to record vote')
      }
      
      return data
    } catch (error) {
      console.error('Vote review error:', error)
      return {
        success: false,
        message: error.message || 'Failed to record vote'
      }
    }
  },

  // Seller response to review
  async respondToReview(token, reviewId, comment) {
    try {
      const response = await fetch(`${API_BASE_URL}/${reviewId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add response')
      }
      
      return data
    } catch (error) {
      console.error('Respond to review error:', error)
      return {
        success: false,
        message: error.message || 'Failed to add response'
      }
    }
  }
}