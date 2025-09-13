const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
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

// Get all products for buyers (public)
export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/featured?limit=${limit}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch featured products');
    }

    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get single product
export const getProduct = async (productId) => {
  try {
    const headers = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      headers
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product');
    }

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get seller's products
export const getSellerProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/products/seller/my?${queryParams}`, {
      headers: createHeaders()
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch seller products');
    }

    return data;
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

// Get product statistics
export const getProductStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/seller/stats`, {
      headers: createHeaders()
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product stats');
    }

    return data;
  } catch (error) {
    console.error('Error fetching product stats:', error);
    throw error;
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('unit', productData.unit);
    formData.append('stock', productData.stock);
    formData.append('category', productData.category);
    
    // Optional fields
    if (productData.originalPrice) formData.append('originalPrice', productData.originalPrice);
    if (productData.minOrderQuantity) formData.append('minOrderQuantity', productData.minOrderQuantity);
    if (productData.maxOrderQuantity) formData.append('maxOrderQuantity', productData.maxOrderQuantity);
    if (productData.tags) formData.append('tags', JSON.stringify(productData.tags));
    if (productData.harvestDate) formData.append('harvestDate', productData.harvestDate);
    if (productData.expiryDate) formData.append('expiryDate', productData.expiryDate);
    if (productData.farmLocation) formData.append('farmLocation', productData.farmLocation);
    if (productData.isOrganic !== undefined) formData.append('isOrganic', productData.isOrganic);
    if (productData.isFeatured !== undefined) formData.append('isFeatured', productData.isFeatured);
    if (productData.nutritionInfo) formData.append('nutritionInfo', JSON.stringify(productData.nutritionInfo));
    
    // Append images
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }

    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    if (productData.name) formData.append('name', productData.name);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price) formData.append('price', productData.price);
    if (productData.unit) formData.append('unit', productData.unit);
    if (productData.stock !== undefined) formData.append('stock', productData.stock);
    if (productData.category) formData.append('category', productData.category);
    
    // Optional fields
    if (productData.originalPrice !== undefined) formData.append('originalPrice', productData.originalPrice || '');
    if (productData.minOrderQuantity) formData.append('minOrderQuantity', productData.minOrderQuantity);
    if (productData.maxOrderQuantity) formData.append('maxOrderQuantity', productData.maxOrderQuantity);
    if (productData.tags) formData.append('tags', JSON.stringify(productData.tags));
    if (productData.harvestDate) formData.append('harvestDate', productData.harvestDate);
    if (productData.expiryDate) formData.append('expiryDate', productData.expiryDate);
    if (productData.farmLocation) formData.append('farmLocation', productData.farmLocation);
    if (productData.isOrganic !== undefined) formData.append('isOrganic', productData.isOrganic);
    if (productData.isFeatured !== undefined) formData.append('isFeatured', productData.isFeatured);
    if (productData.isActive !== undefined) formData.append('isActive', productData.isActive);
    if (productData.nutritionInfo) formData.append('nutritionInfo', JSON.stringify(productData.nutritionInfo));
    
    // Append new images if provided
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image, index) => {
        formData.append('images', image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }

    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }

    return data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
