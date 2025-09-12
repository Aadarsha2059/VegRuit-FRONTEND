// Dashboard API Service Layer for MERN stack integration
// This layer provides dashboard-specific API calls

const API_BASE_URL = 'http://localhost:5000/api'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('vegruit_token')
}

// Common headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const dashboardAPI = {
  // Buyer Dashboard APIs
  async getBuyerDashboardData() {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for buyer dashboard:', error.message)
      return {
        success: true,
        data: mockDashboardData.buyer
      }
    }
  },

  async getBuyerOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/orders`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for buyer orders:', error.message)
      return {
        success: true,
        data: { orders: mockDashboardData.buyer.orders }
      }
    }
  },

  async getBuyerFavorites() {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/favorites`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch favorites')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for buyer favorites:', error.message)
      return {
        success: true,
        data: { favorites: mockDashboardData.buyer.favorites }
      }
    }
  },

  async getBuyerProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/buyer/products`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for buyer products:', error.message)
      return {
        success: true,
        data: { products: mockDashboardData.buyer.recentProducts }
      }
    }
  },

  // Seller Dashboard APIs
  async getSellerDashboardData() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for seller dashboard:', error.message)
      return {
        success: true,
        data: mockDashboardData.seller
      }
    }
  },

  async getSellerProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/products`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for seller products:', error.message)
      return {
        success: true,
        data: { products: mockDashboardData.seller.products }
      }
    }
  },

  async getSellerOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/orders`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for seller orders:', error.message)
      return {
        success: true,
        data: { orders: mockDashboardData.seller.orders }
      }
    }
  },

  async getSellerEarnings() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/earnings`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch earnings')
      }
      
      return data
    } catch (error) {
      console.warn('Using fallback data for seller earnings:', error.message)
      return {
        success: true,
        data: mockDashboardData.seller.earnings
      }
    }
  },

  // Product Management APIs
  async addProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add product'
      }
    }
  },

  async updateProduct(productId, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
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

  async deleteProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
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

  // Order Management APIs
  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update order status'
      }
    }
  },

  // Profile Management APIs
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      }
    }
  }
}

// Mock data for development (when backend endpoints are not ready)
export const mockDashboardData = {
  buyer: {
    overview: {
      totalOrders: 12,
      favoriteItems: 8,
      totalSpent: 4500,
      deliveryAddress: 'Ward 5, Thamel, Kathmandu'
    },
    orders: [
      {
        id: 'ORD001',
        date: '2024-01-15',
        status: 'Delivered',
        items: [
          { name: 'Fresh Apples', quantity: 2, price: 180, farmer: 'Green Valley Farm' },
          { name: 'Organic Cauliflower', quantity: 1, price: 80, farmer: 'Fresh Harvest Farm' }
        ],
        total: 440,
        deliveryAddress: 'Ward 5, Thamel, Kathmandu'
      },
      {
        id: 'ORD002',
        date: '2024-01-20',
        status: 'Processing',
        items: [
          { name: 'Juicy Oranges', quantity: 3, price: 120, farmer: 'Green Valley Farm' },
          { name: 'Red Tomatoes', quantity: 2, price: 90, farmer: 'Fresh Harvest Farm' }
        ],
        total: 540,
        deliveryAddress: 'Ward 5, Thamel, Kathmandu'
      }
    ],
    favorites: [
      { id: 1, name: 'Fresh Apples', image: '🍎', price: 'Rs. 180/kg', farmer: 'Green Valley Farm' },
      { id: 2, name: 'Organic Cauliflower', image: '🥦', price: 'Rs. 80/kg', farmer: 'Fresh Harvest Farm' },
      { id: 3, name: 'Juicy Oranges', image: '🍊', price: 'Rs. 120/kg', farmer: 'Green Valley Farm' }
    ],
    recentProducts: [
      { id: 1, name: 'Fresh Mangoes', price: 'Rs. 200/kg', farmer: 'Green Valley Farm', rating: 4.5 },
      { id: 2, name: 'Organic Cucumbers', price: 'Rs. 60/kg', farmer: 'Fresh Harvest Farm', rating: 4.2 },
      { id: 3, name: 'Sweet Corn', price: 'Rs. 100/kg', farmer: 'Green Valley Farm', rating: 4.7 }
    ]
  },
  seller: {
    overview: {
      todayEarnings: 1200,
      activeProducts: 12,
      pendingOrders: 3,
      customerRating: 4.6
    },
    products: [
      {
        id: 1,
        name: 'Fresh Apples',
        category: 'Fruits',
        price: 180,
        stock: 50,
        unit: 'kg',
        status: 'active',
        rating: 4.5,
        orders: 12
      },
      {
        id: 2,
        name: 'Organic Cauliflower',
        category: 'Vegetables',
        price: 80,
        stock: 25,
        unit: 'kg',
        status: 'active',
        rating: 4.2,
        orders: 8
      }
    ],
    orders: [
      {
        id: 'ORD001',
        date: '2024-01-15',
        status: 'Delivered',
        customer: 'John Doe',
        items: [{ name: 'Fresh Apples', quantity: 2, price: 180 }],
        total: 360,
        deliveryAddress: 'Ward 5, Thamel, Kathmandu'
      }
    ],
    earnings: {
      today: 1200,
      thisWeek: 8500,
      thisMonth: 32000,
      total: 125000
    }
  }
}