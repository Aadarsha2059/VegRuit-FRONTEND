const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('vegruit_token');
};

// Create headers with auth token
const createHeaders = (includeContentType = true) => {
  const headers = {
    'Authorization': `Bearer ${getAuthToken()}`
  };
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

// Get all categories for seller
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: createHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }

    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get single category
export const getCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'GET',
      headers: createHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch category');
    }

    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData) => {
  try {
    const formData = new FormData();
    
    // Handle both FormData input and regular object input
    if (categoryData instanceof FormData) {
      // If it's already FormData, use it directly
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: categoryData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create category');
      }

      return data;
    } else {
      // Convert object to FormData
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description || '');
      formData.append('isActive', categoryData.isActive !== undefined ? categoryData.isActive : true);
      
      // Append image if provided
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create category');
      }

      return data;
    }
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description || '');
    formData.append('isActive', categoryData.isActive);
    
    // Append image if provided
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update category');
    }

    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete category');
    }

    return data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Get category statistics
export const getCategoryStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/stats`, {
      method: 'GET',
      headers: createHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch category stats');
    }

    return data;
  } catch (error) {
    console.error('Error fetching category stats:', error);
    throw error;
  }
};
