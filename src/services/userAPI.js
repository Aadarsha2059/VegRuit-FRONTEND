const API_BASE_URL = 'http://localhost:5001/api/users';

// User API functions
export const userAPI = {
  // Get user by ID (public profile info)
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      if (error instanceof TypeError && error.message && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        };
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch user'
      };
    }
  },

  // Get seller profile (public info including contact details)
  async getSellerProfile(sellerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/${sellerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch seller profile');
      }

      return data;
    } catch (error) {
      console.error('Get seller profile error:', error);
      if (error instanceof TypeError && error.message && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        };
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch seller profile'
      };
    }
  },

  // Get multiple sellers by IDs
  async getSellersByIds(sellerIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/sellers/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sellerIds })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sellers');
      }

      return data;
    } catch (error) {
      console.error('Get sellers error:', error);
      if (error instanceof TypeError && error.message && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please make sure the backend server is running.'
        };
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch sellers'
      };
    }
  }
};
