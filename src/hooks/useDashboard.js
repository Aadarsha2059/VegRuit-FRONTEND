import { useState, useEffect } from 'react';
import { dashboardAPI, mockDashboardData } from '../services/dashboardAPI';
import { toast } from 'react-hot-toast';

// Custom hook for buyer dashboard data
export const useBuyerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getBuyerDashboardData();
      
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        // Fallback to mock data if API fails
        setData(mockDashboardData.buyer);
        console.warn('Using mock data for buyer dashboard');
      }
    } catch (err) {
      setError(err.message);
      setData(mockDashboardData.buyer);
      console.warn('Using mock data due to error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { data, loading, error, refetch: fetchDashboardData };
};

// Custom hook for seller dashboard data
export const useSellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSellerDashboardData();
      
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        // Fallback to mock data if API fails
        setData(mockDashboardData.seller);
        console.warn('Using mock data for seller dashboard');
      }
    } catch (err) {
      setError(err.message);
      setData(mockDashboardData.seller);
      console.warn('Using mock data due to error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { data, loading, error, refetch: fetchDashboardData };
};

// Custom hook for buyer orders
export const useBuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getBuyerOrders();
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setError(null);
      } else {
        setOrders(mockDashboardData.buyer.orders);
        console.warn('Using mock orders data');
      }
    } catch (err) {
      setError(err.message);
      setOrders(mockDashboardData.buyer.orders);
      console.warn('Using mock orders due to error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
};

// Custom hook for seller products
export const useSellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSellerProducts();
      
      if (response.success) {
        setProducts(response.data.products || []);
        setError(null);
      } else {
        setProducts(mockDashboardData.seller.products);
        console.warn('Using mock products data');
      }
    } catch (err) {
      setError(err.message);
      setProducts(mockDashboardData.seller.products);
      console.warn('Using mock products due to error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await dashboardAPI.addProduct(productData);
      
      if (response.success) {
        toast.success('Product added successfully!');
        fetchProducts(); // Refresh the list
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to add product');
        return { success: false, message: response.message };
      }
    } catch (err) {
      toast.error('Failed to add product');
      return { success: false, message: err.message };
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const response = await dashboardAPI.updateProduct(productId, productData);
      
      if (response.success) {
        toast.success('Product updated successfully!');
        fetchProducts(); // Refresh the list
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to update product');
        return { success: false, message: response.message };
      }
    } catch (err) {
      toast.error('Failed to update product');
      return { success: false, message: err.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await dashboardAPI.deleteProduct(productId);
      
      if (response.success) {
        toast.success('Product deleted successfully!');
        fetchProducts(); // Refresh the list
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to delete product');
        return { success: false, message: response.message };
      }
    } catch (err) {
      toast.error('Failed to delete product');
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

// Custom hook for seller orders
export const useSellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSellerOrders();
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setError(null);
      } else {
        setOrders(mockDashboardData.seller.orders);
        console.warn('Using mock orders data');
      }
    } catch (err) {
      setError(err.message);
      setOrders(mockDashboardData.seller.orders);
      console.warn('Using mock orders due to error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await dashboardAPI.updateOrderStatus(orderId, status);
      
      if (response.success) {
        toast.success('Order status updated successfully!');
        fetchOrders(); // Refresh the list
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to update order status');
        return { success: false, message: response.message };
      }
    } catch (err) {
      toast.error('Failed to update order status');
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { 
    orders, 
    loading, 
    error, 
    refetch: fetchOrders,
    updateOrderStatus
  };
};