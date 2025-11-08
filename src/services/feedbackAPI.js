import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create feedback
export const createFeedback = async (token, feedbackData) => {
  try {
    const response = await axios.post(
      `${API_URL}/feedbacks`,
      feedbackData,
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
      message: error.response?.data?.message || 'Failed to submit feedback'
    };
  }
};

// Get user's feedbacks
export const getUserFeedbacks = async (token, params = {}) => {
  try {
    const response = await axios.get(
      `${API_URL}/feedbacks/my-feedbacks`,
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
      message: error.response?.data?.message || 'Failed to fetch feedbacks'
    };
  }
};

// Get homepage feedbacks (public)
export const getHomepageFeedbacks = async (limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/feedbacks/homepage`,
      {
        params: { limit }
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch feedbacks'
    };
  }
};

// Get single feedback
export const getFeedback = async (token, feedbackId) => {
  try {
    const response = await axios.get(
      `${API_URL}/feedbacks/${feedbackId}`,
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
      message: error.response?.data?.message || 'Failed to fetch feedback'
    };
  }
};

// Update feedback
export const updateFeedback = async (token, feedbackId, feedbackData) => {
  try {
    const response = await axios.put(
      `${API_URL}/feedbacks/${feedbackId}`,
      feedbackData,
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
      message: error.response?.data?.message || 'Failed to update feedback'
    };
  }
};

// Delete feedback
export const deleteFeedback = async (token, feedbackId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/feedbacks/${feedbackId}`,
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
      message: error.response?.data?.message || 'Failed to delete feedback'
    };
  }
};

export const feedbackAPI = {
  createFeedback,
  getUserFeedbacks,
  getHomepageFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback
};
