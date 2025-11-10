// Auth API Service for VegRuit Marketplace
// Handles all authentication-related API calls

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth`;

// Storage keys for local storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'vegruit_auth_token',
  USER_DATA: 'vegruit_user_data',
  USER_TYPE: 'vegruit_user_type'
};

// Authentication API functions
export const authAPI = {
  // Storage management
  getAuthToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  getUserData: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },
  getUserType: () => localStorage.getItem(STORAGE_KEYS.USER_TYPE),

  // Set authentication data
  setAuthData: (token, userData, userType) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
  },

  // Clear authentication data
  clearAuthData: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
  },

  // Check if user exists
  async checkUserExists(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check user');
      }

      return {
        success: true,
        exists: data.exists,
        userType: data.userType,
        message: data.message
      };
    } catch (error) {
      console.error('Check user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to check user',
        exists: false
      };
    }
  },

  // Login user (buyer or seller)
  async login(credentials, expectedUserType = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
          field: data.field,
          code: data.code
        };
      }

      // Check if user type matches expected type (if provided)
      if (expectedUserType && data.data && data.data.user) {
        const userTypes = Array.isArray(data.data.userType) ? data.data.userType : [data.data.userType];
        const isBuyer = data.data.user.isBuyer || userTypes.includes('buyer');
        const isSeller = data.data.user.isSeller || userTypes.includes('seller');
        
        if (expectedUserType === 'buyer' && !isBuyer) {
          return {
            success: false,
            message: 'This account is not registered as a buyer. Please use seller login.',
            code: 'wrong_user_type'
          };
        }
        
        if (expectedUserType === 'seller' && !isSeller) {
          return {
            success: false,
            message: 'This account is not registered as a seller. Please use buyer login.',
            code: 'wrong_user_type'
          };
        }
      }

      // Save auth data to local storage
      const userType = data.data.userType || (Array.isArray(data.data.user.userType) ? data.data.user.userType : [data.data.user.userType]);
      this.setAuthData(data.data.token, data.data.user, JSON.stringify(userType));

      return {
        success: true,
        user: data.data.user,
        token: data.data.token,
        userType: userType,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        code: 'network_error'
      };
    }
  },

  // Buyer Login
  async loginBuyer(credentials) {
    return this.login(credentials, 'buyer');
  },

  // Seller Login
  async loginSeller(credentials) {
    return this.login(credentials, 'seller');
  },

  // Register user (buyer or seller)
  async register(userData, endpointType) {
    try {
      const endpoint = endpointType === 'buyer' ? '/buyer/register' : 
                      endpointType === 'seller' ? '/seller/register' : 
                      '/register';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed',
          field: data.field,
          code: data.code
        };
      }

      // Auto-login after registration
      if (data.data && data.data.token) {
        const userType = data.data.userType || (Array.isArray(data.data.user.userType) ? data.data.user.userType : [data.data.user.userType]);
        this.setAuthData(data.data.token, data.data.user, JSON.stringify(userType));
      }

      return {
        success: true,
        user: data.data.user,
        token: data.data.token,
        userType: data.data.userType,
        message: 'Registration successful!',
        requiresVerification: data.requiresVerification
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        code: 'network_error'
      };
    }
  },

  async registerBuyer(userData) {
    return this.register(userData, 'buyer');
  },

  async registerSeller(userData) {
    return this.register(userData, 'seller');
  },

  // Logout
  async logout() {
    try {
      const token = this.getAuthToken();
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
      return { success: true };
    }
  },

  // Verify token
  async verifyAuth() {
    const token = this.getAuthToken();
    if (!token) return { isAuthenticated: false };

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        this.clearAuthData();
        return { isAuthenticated: false };
      }

      const data = await response.json();
      return {
        isAuthenticated: true,
        user: data.user,
        userType: this.getUserType()
      };
    } catch (error) {
      console.error('Auth verification error:', error);
      return { isAuthenticated: false };
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    const token = this.getAuthToken();
    if (!token) return { success: false, message: 'Not authenticated' };

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to update profile'
        };
      }

      // Update stored user data
      const userData = this.getUserData();
      if (userData) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
          ...userData,
          ...profileData
        }));
      }

      return {
        success: true,
        user: data.user,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.'
      };
    }
  },

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to request password reset'
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset instructions sent to your email'
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Network error. Please try again later.'
      };
    }
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to reset password'
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset successful. You can now log in with your new password.'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Network error. Please try again later.'
      };
    }
  }
};

// User type constants
export const USER_TYPES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin'
};

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  FARMER: 'farmer',
  WHOLESALER: 'wholesaler',
  RETAILER: 'retailer',
  ADMIN: 'admin'
};

// Auth status constants
export const AUTH_STATUS = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  LOADING: 'loading'
};
