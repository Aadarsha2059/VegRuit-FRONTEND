import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Add product to favorites
export const addToFavorites = async (token, productId) => {
  try {
    const response = await axios.post(
      `${API_URL}/favorites/add`,
      { productId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add to favorites'
    };
  }
};

// Remove product from favorites
export const removeFromFavorites = async (token, productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/favorites/remove/${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove from favorites'
    };
  }
};

// Get user's favorites
export const getUserFavorites = async (token, params = {}) => {
  try {
    const response = await axios.get(
      `${API_URL}/favorites/my-favorites`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch favorites'
    };
  }
};

// Check if product is favorited
export const checkFavorite = async (token, productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/favorites/check/${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to check favorite status'
    };
  }
};

// Get favorite count
export const getFavoriteCount = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/favorites/count`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get favorite count'
    };
  }
};

export const favoritesAPI = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavorite,
  getFavoriteCount
};
