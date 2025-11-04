import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';
import { useSellerDashboard, useSellerProducts, useSellerOrders } from '../hooks/useDashboard';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getCategoryStats 
} from '../services/categoryAPI';
import {
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} from '../services/productAPI';
import { authAPI } from '../services/authAPI';
import NepaliWelcomeDialog from '../components/NepaliWelcomeDialog';
import NepaliCalendar from '../components/NepaliCalendar';
import Calendar from '../components/Calendar';
import '../styles/SellerDashboard.css';
import { FaArrowLeft, FaBox, FaChartLine, FaClipboardList, FaShoppingCart, FaStore, FaTags, FaUsers } from 'react-icons/fa';

const SellerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNepaliWelcome, setShowNepaliWelcome] = useState(false); // Changed to false to prevent initial overlay
  const [showNepaliCalendar, setShowNepaliCalendar] = useState(false);
  const [dialogAnimationClass, setDialogAnimationClass] = useState('fade-in');
  const { data: dashboardData, loading: dashboardLoading, refetch: refetchDashboard } = useSellerDashboard();
  const { products, loading: productsLoading, addProduct, updateProduct: updateProductItem, deleteProduct: deleteProductItem } = useSellerProducts();
  const { orders, loading: ordersLoading, updateOrderStatus } = useSellerOrders();
  
  // Ensure we have user data
  const [userData, setUserData] = useState(user || {});
  
  // Notification system for new orders
  const [notifications, setNotifications] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('sellerLoggedIn');
    if (!isLoggedIn) {
      toast.error('Please login to access the seller dashboard');
      navigate('/seller-login');
      return;
    }
    
    // Load user data from localStorage if not provided
    if (!user || Object.keys(userData).length === 0) {
      const storedUser = localStorage.getItem('sellerData');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          toast.error('Error loading user data');
          navigate('/seller-login');
        }
      } else {
        toast.error('User data not found');
        navigate('/seller-login');
      }
    }
    
    // Fetch dashboard data
    refetchDashboard?.();
    
    // Simulate new order notifications
    const checkForNewOrders = () => {
      if (orders && orders.length > 0) {
        const pendingOrders = orders.filter(order => order.status === 'pending');
        setNewOrderCount(pendingOrders.length);
        
        // Create notifications for recent orders
        const recentNotifications = pendingOrders.slice(0, 3).map((order, index) => ({
          id: order._id,
          message: `New order #${order._id?.substring(0, 8)} - Rs. ${order.total}`,
          type: 'order',
          timestamp: new Date(order.createdAt),
          orderNumber: index + 1
        }));
        setNotifications(recentNotifications);
      }
    };
    
    checkForNewOrders();
  }, [user, navigate, orders]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout if onLogout prop is not provided
      localStorage.removeItem('sellerLoggedIn');
      localStorage.removeItem('sellerData');
    }
    navigate('/');
    toast.success('Logged out successfully!');
  };

  const handleCloseNepaliWelcome = () => {
    // Add smooth exit animation before hiding
    setDialogAnimationClass('fade-out');
    setTimeout(() => {
      setShowNepaliWelcome(false);
    }, 300);
  };

  const handleSkipForSession = () => {
    // Skip dialog for current session only
    sessionStorage.setItem('skipNepaliDialog', 'true');
    handleCloseNepaliWelcome();
  };

  const handleShowNepaliWelcome = () => {
    setShowNepaliWelcome(true);
    setDialogAnimationClass('fade-in');
    setTimeout(() => {
      setDialogAnimationClass('fade-in active');
    }, 100);
  };

  const handleShowNepaliCalendar = () => {
    setShowNepaliCalendar(true);
  };

  const handleCloseNepaliCalendar = () => {
    setShowNepaliCalendar(false);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Product management handlers
  const handleAddProduct = () => {
    setActiveTab('add-product');
  };

  const handleEditProduct = (product) => {
    // Store the product to edit and switch to edit mode
    setActiveTab('edit-product');
    // You can store the product in state if needed
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('sellerToken') || authAPI.getAuthToken();
        const response = await deleteProduct(token, productId);
        if (response.success) {
          toast.success('Product deleted successfully!');
          // Refresh products list
          if (deleteProductItem) {
            deleteProductItem(productId);
          }
        } else {
          toast.error(response.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  // Category management handlers
  const handleAddCategory = () => {
    setActiveTab('add-category');
  };

  const handleEditCategory = (category) => {
    setActiveTab('edit-category');
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('sellerToken') || authAPI.getAuthToken();
        const response = await deleteCategory(token, categoryId);
        if (response.success) {
          toast.success('Category deleted successfully!');
          // Refresh categories list
        } else {
          toast.error(response.message || 'Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  // Check if user wants to skip dialog for current session
  useEffect(() => {
    const skipDialog = sessionStorage.getItem('skipNepaliDialog');
    if (skipDialog === 'true') {
      setShowNepaliWelcome(false);
    }
  }, []);

  // Generate placeholder stats if data is not available
  const stats = dashboardData?.stats || {
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    totalCustomers: 0
  };

  // Render dashboard content based on active tab
  const renderDashboardContent = () => {
    if (dashboardLoading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-tab">
            <div className="back-button-container">
              <button className="back-button" onClick={handleGoBack}>
                <FaArrowLeft /> Back
              </button>
            </div>
            
            <h2>Welcome, {userData.firstName || 'Seller'}!</h2>
            <p className="welcome-message">Here's an overview of your farm business</p>
            
            <div className="overview-stats">
              <div className="stat-card">
                <div className="stat-icon products-icon">
                  <FaBox />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalProducts || 0}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon orders-icon">
                  <FaShoppingCart />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalOrders || 0}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon pending-icon">
                  <FaClipboardList />
                </div>
                <div className="stat-content">
                  <h3>{stats.pendingOrders || 0}</h3>
                  <p>Pending Orders</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon earnings-icon">
                  <FaChartLine />
                </div>
                <div className="stat-content">
                  <h3>Rs. {stats.totalEarnings?.toLocaleString() || 0}</h3>
                  <p>Total Earnings</p>
                </div>
              </div>
            </div>
            
            <div className="dashboard-sections">
              <div className="recent-orders-section">
                <h3>Recent Orders</h3>
                {orders && orders.length > 0 ? (
                  <div className="recent-orders-list">
                    {orders.slice(0, 5).map(order => (
                      <div className="order-item" key={order._id}>
                        <div className="order-info">
                          <p className="order-id">Order #{order._id?.substring(0, 8)}</p>
                          <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="order-status">
                          <span className={`status-badge status-${order.status}`}>
                            {order.status}
                          </span>
                          <p className="order-amount">Rs. {order.total?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data-message">No recent orders found.</p>
                )}
                <button className="view-all-btn" onClick={() => setActiveTab('orders')}>
                  View All Orders
                </button>
              </div>
              
              <div className="recent-products-section">
                <h3>Recent Products</h3>
                {products && products.length > 0 ? (
                  <div className="recent-products-list">
                    {products.slice(0, 5).map(product => (
                      <div className="product-item" key={product._id}>
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          <p className="product-category">{product.category?.name || 'Uncategorized'}</p>
                        </div>
                        <div className="product-price">
                          <p>Rs. {product.price?.toLocaleString()}</p>
                          <p className="product-stock">Stock: {product.stock || 0}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data-message">No products found.</p>
                )}
                <button className="view-all-btn" onClick={() => setActiveTab('products')}>
                  View All Products
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'products':
        return <EnhancedProductsTab 
          products={products} 
          loading={productsLoading}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddProduct={handleAddProduct}
        />;
      
      case 'orders':
        return (
          <div className="orders-tab">
            <div className="back-button-container">
              <button className="back-button" onClick={handleGoBack}>
                <FaArrowLeft /> Back
              </button>
            </div>
            <h2>Your Orders</h2>
            {ordersLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="orders-list">
                {orders.map(order => (
                  <div className="order-card" key={order._id}>
                    <div className="order-header">
                      <h3>Order #{order._id?.substring(0, 8)}</h3>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p><strong>Customer:</strong> {order.user?.firstName} {order.user?.lastName}</p>
                      <p><strong>Total:</strong> Rs. {order.total?.toLocaleString()}</p>
                    </div>
                    <div className="order-actions">
                      <button className="view-details-btn">View Details</button>
                      <select 
                        className="status-select"
                        defaultValue={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">No orders found.</p>
            )}
          </div>
        );
      
      default:
        return (
          <div className="coming-soon-tab">
            <div className="back-button-container">
              <button className="back-button" onClick={handleGoBack}>
                <FaArrowLeft /> Back
              </button>
            </div>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="coming-soon">
              <h3>Coming Soon!</h3>
              <p>This feature is currently under development. Please check back later.</p>
            </div>
          </div>
        );
    }
  };

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { key: 'categories', label: 'Categories', icon: <FaTags /> },
    { key: 'products', label: 'Products', icon: <FaBox /> },
    { key: 'orders', label: 'Orders', icon: <FaShoppingCart /> },
    { key: 'earnings', label: 'Earnings', icon: <FaChartLine /> },
    { key: 'customers', label: 'Customers', icon: <FaUsers /> },
    { key: 'inventory', label: 'Inventory', icon: <FaClipboardList /> },
    { key: 'farm', label: 'Farm', icon: <FaStore /> },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      overview: 'Farm Dashboard Overview',
      categories: 'Category Management',
      products: 'Product Management',
      orders: 'Order Management',
      earnings: 'Earnings & Analytics',
      customers: 'Customer Management',
      inventory: 'Inventory Management',
      farm: 'Farm Settings',
      settings: 'Account Settings'
    }
    return titles[tab] || 'Seller Dashboard'
  }

  const renderTabContent = () => {
    if (dashboardLoading) {
      return <LoadingSpinner message="Loading dashboard data..." />
    }

    switch (activeTab) {
      case 'overview':
        return <SellerOverviewTab user={user} data={dashboardData} />
      case 'categories':
        return <SellerCategoriesTab />
      case 'products':
        return <SellerProductsTab 
          products={products} 
          loading={productsLoading}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
        />
      case 'orders':
        return <SellerOrdersTab 
          orders={orders} 
          loading={ordersLoading}
          onUpdateStatus={updateOrderStatus}
          notifications={notifications}
          newOrderCount={newOrderCount}
        />
      case 'earnings':
        return <SellerEarningsTab earnings={dashboardData?.overview} orders={orders} />
      case 'customers':
        return <SellerCustomersTab orders={orders} />
      case 'inventory':
        return <SellerInventoryTab products={products} />
      case 'farm':
        return <SellerFarmTab user={user} />
      case 'settings':
        return <SellerSettingsTab user={user} />
      default:
        return <SellerOverviewTab user={user} data={dashboardData} />
    }
  }

  return (
    <>
      <NepaliWelcomeDialog
        isOpen={showNepaliWelcome}
        onClose={handleCloseNepaliWelcome}
        onSkipForSession={handleSkipForSession}
        user={userData}
        animationClass={dialogAnimationClass}
      />
      <NepaliCalendar
        isOpen={showNepaliCalendar}
        onClose={handleCloseNepaliCalendar}
      />
      <DashboardLayout
        user={userData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        sidebarItems={sidebarItems}
        headerTitle={getTabTitle(activeTab)}
        onHelpClick={handleShowNepaliWelcome}
        onCalendarClick={handleShowNepaliCalendar}
      >
        {renderDashboardContent()}
      </DashboardLayout>
    </>
  )
}

// Loading Spinner Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
)

// Stat Card Component
const StatCard = ({ title, value, label, icon, color = 'primary' }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h4>{title}</h4>
      <div className="stat-value">{value}</div>
      <small className="stat-label">{label}</small>
    </div>
  </div>
)

// Seller Categories Tab Component
const SellerCategoriesTab = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadCategories()
    loadCategoryStats()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await getCategories()
      if (response.success) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const loadCategoryStats = async () => {
    try {
      const response = await getCategoryStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to load category stats:', error)
    }
  }

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await createCategory(categoryData)
      if (response.success) {
        toast.success('Category created successfully!')
        setShowAddForm(false)
        loadCategories()
        loadCategoryStats()
      } else {
        toast.error(response.message || 'Failed to create category')
      }
    } catch (error) {
      toast.error('Failed to create category')
    }
  }

  const handleUpdateCategory = async (categoryId, categoryData) => {
    try {
      const response = await updateCategory(categoryId, categoryData)
      if (response.success) {
        toast.success('Category updated successfully!')
        setEditingCategory(null)
        loadCategories()
        loadCategoryStats()
      } else {
        toast.error(response.message || 'Failed to update category')
      }
    } catch (error) {
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const response = await deleteCategory(categoryId)
        if (response.success) {
          toast.success('Category deleted successfully!')
          loadCategories()
          loadCategoryStats()
        } else {
          toast.error(response.message || 'Failed to delete category')
        }
      } catch (error) {
        toast.error('Failed to delete category')
      }
    }
  }

  if (loading) return <LoadingSpinner message="Loading categories..." />

  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h3>Category Management</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          + Add Category
        </button>
      </div>

      {/* Category Stats */}
      {stats && (
        <div className="category-stats">
          <StatCard
            title="Total Categories"
            value={stats.totalCategories}
            label="Active categories"
            icon="📂"
          />
          <StatCard
            title="Categories with Products"
            value={stats.categoriesWithProducts}
            label="Have products"
            icon="📦"
            color="success"
          />
          <StatCard
            title="Top Category"
            value={stats.topCategories[0]?.name || 'None'}
            label={`${stats.topCategories[0]?.productCount || 0} products`}
            icon="🏆"
            color="info"
          />
        </div>
      )}

      {/* Add Category Form */}
      {showAddForm && (
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Categories List */}
      <div className="categories-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id} className="category-item">
              {editingCategory === category._id ? (
                <CategoryForm
                  category={category}
                  onSubmit={(data) => handleUpdateCategory(category._id, data)}
                  onCancel={() => setEditingCategory(null)}
                />
              ) : (
                <CategoryCard
                  category={category}
                  onEdit={() => setEditingCategory(category._id)}
                  onDelete={() => handleDeleteCategory(category._id)}
                />
              )}
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No categories found</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Create Your First Category
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Category Card Component with Icons
const CategoryCard = ({ category, onEdit, onDelete }) => {
  // Define icons for common categories
  const getCategoryIcon = (categoryName) => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('fruit')) return '🍎';
    if (lowerName.includes('vegetable')) return '🥕';
    if (lowerName.includes('leaf') || lowerName.includes('green')) return '🥬';
    if (lowerName.includes('herb')) return '🌿';
    if (lowerName.includes('nut')) return '🥜';
    if (lowerName.includes('grain')) return '🌾';
    if (lowerName.includes('dairy')) return '🥛';
    if (lowerName.includes('meat')) return '🍖';
    if (lowerName.includes('fish') || lowerName.includes('seafood')) return '🐟';
    if (lowerName.includes('egg')) return '🥚';
    if (lowerName.includes('flower')) return '🌸';
    if (lowerName.includes('spice') || lowerName.includes('masala')) return '🌶️';
    if (lowerName.includes('oil')) return '🛢️';
    if (lowerName.includes('honey')) return '🍯';
    if (lowerName.includes('tea')) return '🍵';
    if (lowerName.includes('coffee')) return '☕';
    return '📦'; // Default icon
  };

  return (
    <div className="category-card">
      <div className="category-icon">
        {getCategoryIcon(category.name)}
      </div>
      <div className="category-image">
        {category.image ? (
          <img src={category.image} alt={category.name} />
        ) : (
          <div className="placeholder-image">📂</div>
        )}
      </div>
      <div className="category-info">
        <div className="category-header">
          <h4>{category.name}</h4>
          <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
            {category.isActive ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>
        {category.description && (
          <p className="category-description">{category.description}</p>
        )}
        <div className="category-stats">
          <span>📦 {category.productCount} products</span>
          <span>📅 Created {new Date(category.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="category-actions">
        <button className="btn btn-outline" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-outline btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

// Category Form Component
const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    isActive: category?.isActive !== undefined ? category.isActive : true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(category?.image || '')
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters'
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }
    
    setUploading(true)
    
    try {
      const submitData = new FormData()
      submitData.append('name', formData.name.trim())
      submitData.append('description', formData.description.trim())
      submitData.append('isActive', formData.isActive)
      
      if (imageFile) {
        submitData.append('image', imageFile)
      }
      
      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to save category')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)')
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="category-form-overlay">
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-header">
          <h4>{category ? 'Edit Category' : 'Add New Category'}</h4>
          <button type="button" className="close-form-btn" onClick={onCancel}>✕</button>
        </div>
        
        <div className="form-body">
          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={uploading}
              placeholder="Enter category name (e.g., Fruits, Vegetables)"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              disabled={uploading}
              placeholder="Enter category description (optional)"
              className={errors.description ? 'error' : ''}
            />
            <small className="char-count">
              {formData.description.length}/500 characters
            </small>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Category Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="image-input"
              />
              <div className="upload-help-text">
                <small>Choose an image file (JPG, PNG, GIF, WebP). Max size: 5MB</small>
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Category preview" />
                  <button type="button" onClick={removeImage} className="remove-image-btn">
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={uploading}
              />
              <span className="checkmark"></span>
              Active Category
              <small>Active categories are visible to buyers</small>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onCancel} 
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={uploading || !formData.name.trim()}
          >
            {uploading ? (
              <>
                <span className="spinner"></span>
                {category ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              category ? 'Update Category' : 'Create Category'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

const SellerOverviewTab = ({ user, data }) => {
  if (!data) return <LoadingSpinner message="Loading overview..." />

  const { overview, recentOrders = [], topProducts = [], lowStockProducts = [] } = data

  return (
    <div className="overview-tab">
      <div className="overview-stats">
        <StatCard
          title="Today's Earnings"
          value={`Rs. ${overview?.todayEarnings || 0}`}
          label="Today"
          icon="💰"
          color="success"
        />
        <StatCard
          title="Active Products"
          value={overview?.activeProducts || 0}
          label={`Out of ${overview?.totalProducts || 0}`}
          icon="🍎"
        />
        <StatCard
          title="Pending Orders"
          value={overview?.pendingOrders || 0}
          label={`Out of ${overview?.totalOrders || 0}`}
          icon="📦"
          color="warning"
        />
        <StatCard
          title="Customer Rating"
          value={`${overview?.customerRating || 0}⭐`}
          label={`From ${overview?.totalCustomers || 0} customers`}
          icon="⭐"
          color="info"
        />
      </div>

      <div className="overview-sections">
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <div className="orders-preview">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="order-preview-item">
                  <div className="order-preview-header">
                    <span className="order-id">#{order.id}</span>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="order-summary">
                    Customer: {order.customer} • Rs. {order.total}
                  </p>
                  <small>{new Date(order.date).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p className="no-data">No recent orders</p>
            )}
          </div>
        </div>

        <div className="top-products">
          <h3>Top Products</h3>
          <div className="products-preview">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product.id || product._id} className="product-preview-item">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>Rs. {product.price}/{product.unit}</p>
                    <small>Stock: {product.stock} {product.unit}</small>
                  </div>
                  <div className="product-stats">
                    <span>⭐ {product.rating || 0}</span>
                    <span>📦 {product.totalOrders || product.orders || 0} orders</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No products yet</p>
            )}
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="low-stock-alerts">
            <h3>⚠️ Low Stock Alerts</h3>
            <div className="alerts-list">
              {lowStockProducts.map((product) => (
                <div key={product.id || product._id} className="alert-item">
                  <span>{product.name} - Only {product.stock} {product.unit} left</span>
                  <button className="btn btn-primary btn-sm">Restock</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const SellerProductsTab = ({ products, loading, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  if (loading) return <LoadingSpinner message="Loading products..." />

  const filteredProducts = products.filter(product => {
    const categoryMatch = categoryFilter === 'all' || product.category?.toLowerCase() === categoryFilter.toLowerCase()
    const statusMatch = statusFilter === 'all' || product.status === statusFilter
    return categoryMatch && statusMatch
  })

  const handleAddProduct = async (productData) => {
    const result = await onAddProduct(productData)
    if (result.success) {
      setShowAddForm(false)
    }
  }

  const handleUpdateProduct = async (productId, productData) => {
    const result = await onUpdateProduct(productId, productData)
    if (result.success) {
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await onDeleteProduct(productId)
    }
  }

  return (
    <div className="products-tab">
      <div className="tab-header">
        <h3>Product Management</h3>
        <div className="product-filters">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="leafy greens">Leafy Greens</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="low-stock">Low Stock</option>
            <option value="inactive">Inactive</option>
          </select>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add Product
          </button>
        </div>
      </div>

      {showAddForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="products-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id || product._id} className="product-item">
              {editingProduct === (product.id || product._id) ? (
                <ProductForm
                  product={product}
                  onSubmit={(data) => handleUpdateProduct(product.id || product._id, data)}
                  onCancel={() => setEditingProduct(null)}
                />
              ) : (
                <ProductCard
                  product={product}
                  onEdit={() => setEditingProduct(product.id || product._id)}
                  onDelete={() => handleDeleteProduct(product.id || product._id)}
                />
              )}
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No products found</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const ProductCard = ({ product, onEdit, onDelete }) => (
  <div className="product-card">
    <div className="product-info">
      <div className="product-header">
        <h4>{product.name}</h4>
        <span className={`status-badge ${product.status}`}>
          {product.status === 'active' ? '✅ Active' : 
           product.status === 'low-stock' ? '⚠️ Low Stock' : '❌ Inactive'}
        </span>
      </div>
      <p className="product-category">{product.category}</p>
      <p className="product-price">Rs. {product.price}/{product.unit}</p>
      <p className="product-stock">Stock: {product.stock} {product.unit}</p>
      {product.description && (
        <p className="product-description">{product.description}</p>
      )}
    </div>
    <div className="product-stats">
      <div className="stat-item">
        <span>⭐ {product.rating || 0}</span>
      </div>
      <div className="stat-item">
        <span>📦 {product.totalOrders || product.orders || 0} orders</span>
      </div>
    </div>
    <div className="product-actions">
      <button className="btn btn-outline" onClick={onEdit}>
        Edit
      </button>
      <button className="btn btn-outline" onClick={onDelete}>
        Delete
      </button>
    </div>
  </div>
)

const SellerOrdersTab = ({ orders, loading, onUpdateStatus, notifications, newOrderCount }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <LoadingSpinner message="Loading orders..." />

  // Filter and sort orders
  const filteredOrders = orders?.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'amount':
        return b.total - a.total;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  }) || [];

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status.toLowerCase()] || '#718096';
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    await onUpdateStatus(orderId, newStatus);
  };

  return (
    <div className="enhanced-orders-tab">
      <div className="orders-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="header-content">
            <h2>📦 Order Management</h2>
            <p>Track and manage your customer orders</p>
          </div>
        </div>
        
        {newOrderCount > 0 && (
          <div className="notification-badge">
            <span className="badge-count">{newOrderCount}</span>
            <span className="badge-text">New Orders</span>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {notifications && notifications.length > 0 && (
        <div className="notifications-panel">
          <h4>🔔 Recent Order Alerts</h4>
          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-number">{notification.orderNumber}</div>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <small>{new Date(notification.timestamp).toLocaleString()}</small>
                </div>
                <div className="notification-status">New</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="orders-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search orders by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending ({orders?.filter(o => o.status === 'pending').length || 0})</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>
      
      <div className="orders-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="enhanced-order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h4>Order #{order._id?.substring(0, 8)}</h4>
                  <p className="order-date">📅 {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="customer-info">👤 {order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <div className="order-status-section">
                  <span 
                    className="order-status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                  <div className="order-amount">Rs. {order.finalAmount?.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="order-items-preview">
                <h5>📋 Items ({order.items?.length || 0})</h5>
                <div className="items-list">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="item-preview">
                      <div className="item-image">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} />
                        ) : (
                          <div className="item-placeholder">🥬</div>
                        )}
                      </div>
                      <div className="item-details">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="more-items">+{order.items.length - 3} more</div>
                  )}
                </div>
              </div>
              
              <div className="order-actions">
                <button className="action-btn view-btn">
                  👁️ View Details
                </button>
                <select 
                  className="status-update-select"
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="action-btn contact-btn">
                  📞 Contact
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders-state">
            <div className="empty-icon">📦</div>
            <h3>No Orders Found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No orders yet. Orders will appear here when customers place them.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SellerEarningsTab = ({ earnings, orders }) => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('month');
  
  const handleGoBack = () => {
    navigate(-1);
  };

  // Calculate earnings from orders
  const calculateEarnings = () => {
    if (!orders || orders.length === 0) {
      return {
        today: 0,
        week: 0,
        month: 0,
        total: 0,
        transactions: []
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const deliveredOrders = orders.filter(order => order.status === 'delivered');
    
    const todayEarnings = deliveredOrders
      .filter(order => new Date(order.deliveredAt || order.createdAt) >= today)
      .reduce((sum, order) => sum + (order.finalAmount || order.total || 0), 0);

    const weekEarnings = deliveredOrders
      .filter(order => new Date(order.deliveredAt || order.createdAt) >= weekAgo)
      .reduce((sum, order) => sum + (order.finalAmount || order.total || 0), 0);

    const monthEarnings = deliveredOrders
      .filter(order => new Date(order.deliveredAt || order.createdAt) >= monthAgo)
      .reduce((sum, order) => sum + (order.finalAmount || order.total || 0), 0);

    const totalEarnings = deliveredOrders
      .reduce((sum, order) => sum + (order.finalAmount || order.total || 0), 0);

    return {
      today: todayEarnings,
      week: weekEarnings,
      month: monthEarnings,
      total: totalEarnings,
      transactions: deliveredOrders.slice(0, 10)
    };
  };

  const earningsData = calculateEarnings();

  return (
    <div className="enhanced-earnings-tab">
      <div className="earnings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="header-content">
            <h2>💰 Earnings & Analytics</h2>
            <p>Track your farm business performance</p>
          </div>
        </div>
        
        <div className="time-filter">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="earnings-overview">
        <div className="earning-card today">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Rs. {earningsData.today.toLocaleString()}</h3>
            <p>Today's Earnings</p>
            <span className="trend positive">+12%</span>
          </div>
        </div>
        
        <div className="earning-card week">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Rs. {earningsData.week.toLocaleString()}</h3>
            <p>This Week</p>
            <span className="trend positive">+8%</span>
          </div>
        </div>
        
        <div className="earning-card month">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Rs. {earningsData.month.toLocaleString()}</h3>
            <p>This Month</p>
            <span className="trend positive">+15%</span>
          </div>
        </div>
        
        <div className="earning-card total">
          <div className="card-icon">🏆</div>
          <div className="card-content">
            <h3>Rs. {earningsData.total.toLocaleString()}</h3>
            <p>Total Earnings</p>
            <span className="trend neutral">All time</span>
          </div>
        </div>
      </div>

      <div className="earnings-details">
        <div className="earnings-chart-section">
          <h4>📊 Earnings Trend</h4>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="mock-chart">
                <div className="chart-bars">
                  <div className="bar" style={{height: '60%'}}><span>Week 1</span></div>
                  <div className="bar" style={{height: '80%'}}><span>Week 2</span></div>
                  <div className="bar" style={{height: '45%'}}><span>Week 3</span></div>
                  <div className="bar" style={{height: '90%'}}><span>Week 4</span></div>
                </div>
              </div>
              <p>📈 Weekly earnings visualization</p>
            </div>
          </div>
        </div>

        <div className="recent-transactions">
          <h4>💳 Recent Transactions</h4>
          <div className="transactions-list">
            {earningsData.transactions.length > 0 ? (
              earningsData.transactions.map((order) => (
                <div key={order._id} className="transaction-item">
                  <div className="transaction-info">
                    <h5>Order #{order._id?.substring(0, 8)}</h5>
                    <p>{new Date(order.deliveredAt || order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="transaction-amount">
                    +Rs. {(order.finalAmount || order.total || 0).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-transactions">
                <div className="empty-icon">💸</div>
                <p>No completed transactions yet</p>
                <small>Earnings will appear here when orders are delivered</small>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="earnings-insights">
        <div className="insight-card">
          <h4>🎯 Performance Insights</h4>
          <ul>
            <li>Your best selling day is usually Saturday</li>
            <li>Organic vegetables generate 25% more revenue</li>
            <li>Peak ordering time is 6-8 PM</li>
            <li>Customer retention rate: 78%</li>
          </ul>
        </div>
        
        <div className="earning-goals">
          <h4>🏆 Monthly Goals</h4>
          <div className="goal-progress">
            <div className="goal-item">
              <span>Revenue Target</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '65%'}}></div>
              </div>
              <span>Rs. 32,000 / Rs. 50,000</span>
            </div>
            <div className="goal-item">
              <span>Orders Target</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '80%'}}></div>
              </div>
              <span>80 / 100 orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SellerCustomersTab = ({ orders }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const handleGoBack = () => {
    navigate(-1);
  };

  // Extract unique customers from orders
  const getCustomersFromOrders = () => {
    if (!orders || orders.length === 0) return [];
    
    const customerMap = new Map();
    
    orders.forEach(order => {
      const customerId = order.buyer || order.user?._id;
      const customerName = order.buyerName || `${order.user?.firstName} ${order.user?.lastName}`;
      
      if (customerId && customerName !== 'undefined undefined') {
        if (customerMap.has(customerId)) {
          const existing = customerMap.get(customerId);
          existing.totalOrders += 1;
          existing.totalSpent += order.finalAmount || order.total || 0;
          existing.lastOrder = new Date(Math.max(new Date(existing.lastOrder), new Date(order.createdAt)));
        } else {
          customerMap.set(customerId, {
            id: customerId,
            name: customerName,
            email: order.buyerEmail || order.user?.email || 'N/A',
            phone: order.buyerPhone || order.user?.phone || 'N/A',
            totalOrders: 1,
            totalSpent: order.finalAmount || order.total || 0,
            lastOrder: new Date(order.createdAt),
            status: order.status
          });
        }
      }
    });
    
    return Array.from(customerMap.values());
  };

  const customers = getCustomersFromOrders();
  
  // Filter and sort customers
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastOrder) - new Date(a.lastOrder);
      case 'orders':
        return b.totalOrders - a.totalOrders;
      case 'spent':
        return b.totalSpent - a.totalSpent;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const newCustomersThisMonth = customers.filter(customer => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(customer.lastOrder) >= monthAgo;
  }).length;

  const repeatCustomers = customers.filter(customer => customer.totalOrders > 1).length;

  return (
    <div className="enhanced-customers-tab">
      <div className="customers-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="header-content">
            <h2>👥 Customer Management</h2>
            <p>Manage your customer relationships</p>
          </div>
        </div>
      </div>

      <div className="customers-stats">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{customers.length}</h3>
            <p>Total Customers</p>
            <span className="stat-label">All time</span>
          </div>
        </div>
        
        <div className="stat-card new">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>{newCustomersThisMonth}</h3>
            <p>New This Month</p>
            <span className="stat-trend positive">+{Math.round((newCustomersThisMonth / customers.length) * 100)}%</span>
          </div>
        </div>
        
        <div className="stat-card repeat">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{repeatCustomers}</h3>
            <p>Repeat Customers</p>
            <span className="stat-trend positive">{Math.round((repeatCustomers / customers.length) * 100)}% retention</span>
          </div>
        </div>
        
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Rs. {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-label">From customers</span>
          </div>
        </div>
      </div>

      <div className="customers-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Recent Activity</option>
            <option value="orders">Most Orders</option>
            <option value="spent">Highest Spender</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="customers-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-avatar">
                <div className="avatar-placeholder">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="customer-status">
                  {customer.totalOrders > 1 ? '🔄' : '🆕'}
                </div>
              </div>
              
              <div className="customer-info">
                <h4>{customer.name}</h4>
                <p className="customer-email">📧 {customer.email}</p>
                <p className="customer-phone">📞 {customer.phone}</p>
              </div>
              
              <div className="customer-stats">
                <div className="stat-item">
                  <span className="stat-value">{customer.totalOrders}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">Rs. {customer.totalSpent.toLocaleString()}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{new Date(customer.lastOrder).toLocaleDateString()}</span>
                  <span className="stat-label">Last Order</span>
                </div>
              </div>
              
              <div className="customer-actions">
                <button className="action-btn contact">📞 Contact</button>
                <button className="action-btn history">📋 History</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-customers-state">
            <div className="empty-icon">👥</div>
            <h3>No Customers Found</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'Customers will appear here when they place orders.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SellerInventoryTab = ({ products }) => {
  const navigate = useNavigate();
  const [stockFilter, setStockFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleGoBack = () => {
    navigate(-1);
  };

  const activeProducts = products?.filter(p => p.isActive) || [];
  const lowStockProducts = products?.filter(p => p.stock < 10) || [];
  const outOfStockProducts = products?.filter(p => p.stock === 0) || [];

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = stockFilter === 'all' || 
      (stockFilter === 'low' && product.stock < 10) ||
      (stockFilter === 'out' && product.stock === 0) ||
      (stockFilter === 'active' && product.isActive);
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="enhanced-inventory-tab">
      <div className="inventory-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="header-content">
            <h2>📦 Inventory Management</h2>
            <p>Monitor and manage your product stock</p>
          </div>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{products?.length || 0}</h3>
            <p>Total Products</p>
            <span className="stat-label">In catalog</span>
          </div>
        </div>
        
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{activeProducts.length}</h3>
            <p>Active Products</p>
            <span className="stat-trend positive">{Math.round((activeProducts.length / (products?.length || 1)) * 100)}% active</span>
          </div>
        </div>
        
        <div className="stat-card low-stock">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{lowStockProducts.length}</h3>
            <p>Low Stock Items</p>
            <span className="stat-trend warning">Need attention</span>
          </div>
        </div>
        
        <div className="stat-card out-of-stock">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{outOfStockProducts.length}</h3>
            <p>Out of Stock</p>
            <span className="stat-trend danger">Restock needed</span>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="inventory-alerts">
          <h4>⚠️ Stock Alerts</h4>
          <div className="alerts-grid">
            {lowStockProducts.slice(0, 5).map(product => (
              <div key={product._id} className="alert-item">
                <div className="alert-product">
                  <div className="product-image">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="placeholder">🥬</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h5>{product.name}</h5>
                    <p>Only {product.stock} {product.unit} left</p>
                  </div>
                </div>
                <button className="restock-btn">🔄 Restock</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="inventory-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <select 
            value={stockFilter} 
            onChange={(e) => setStockFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Products</option>
            <option value="active">Active Only</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="inventory-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="inventory-item">
              <div className="item-image">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="placeholder">🥬</div>
                )}
                <div className="stock-badge">
                  <span className={`badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'good'}`}>
                    {product.stock} {product.unit}
                  </span>
                </div>
              </div>
              
              <div className="item-content">
                <h4>{product.name}</h4>
                <p className="item-price">Rs. {product.price}/{product.unit}</p>
                <div className="item-status">
                  <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="item-actions">
                <button className="action-btn edit">✏️ Edit</button>
                <button className="action-btn stock">📦 Stock</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-inventory-state">
            <div className="empty-icon">📦</div>
            <h3>No Products Found</h3>
            <p>
              {searchTerm || stockFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Add products to start managing your inventory.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SellerFarmTab = ({ user }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [farmData, setFarmData] = useState({
    farmName: user?.farmName || '',
    farmLocation: user?.farmLocation || '',
    city: user?.city || '',
    phone: user?.phone || '',
    description: user?.description || '',
    farmSize: user?.farmSize || '',
    farmingType: user?.farmingType || 'organic'
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    // Save farm data logic here
    setEditMode(false);
    toast.success('Farm details updated successfully!');
  };

  return (
    <div className="enhanced-farm-tab">
      <div className="farm-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="header-content">
            <h2>🌾 Farm Management</h2>
            <p>Manage your farm information and settings</p>
          </div>
        </div>
        
        <button 
          className="edit-farm-btn"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? '💾 Save Changes' : '✏️ Edit Farm'}
        </button>
      </div>

      <div className="farm-content">
        <div className="farm-profile">
          <div className="farm-avatar">
            <div className="avatar-placeholder">🌾</div>
            <button className="upload-btn">📷 Upload Photo</button>
          </div>
          
          <div className="farm-basic-info">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={farmData.farmName}
                  onChange={(e) => setFarmData({...farmData, farmName: e.target.value})}
                  className="farm-name-input"
                  placeholder="Farm Name"
                />
                <textarea
                  value={farmData.description}
                  onChange={(e) => setFarmData({...farmData, description: e.target.value})}
                  className="farm-description-input"
                  placeholder="Describe your farm..."
                  rows="3"
                />
              </>
            ) : (
              <>
                <h3>{farmData.farmName || 'Your Farm'}</h3>
                <p>{farmData.description || 'A sustainable farm producing fresh, organic vegetables for the local community.'}</p>
              </>
            )}
          </div>
        </div>

        <div className="farm-details-grid">
          <div className="detail-section">
            <h4>📍 Location Details</h4>
            <div className="detail-items">
              <div className="detail-item">
                <label>Farm Location:</label>
                {editMode ? (
                  <input
                    type="text"
                    value={farmData.farmLocation}
                    onChange={(e) => setFarmData({...farmData, farmLocation: e.target.value})}
                  />
                ) : (
                  <span>{farmData.farmLocation || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>City:</label>
                {editMode ? (
                  <input
                    type="text"
                    value={farmData.city}
                    onChange={(e) => setFarmData({...farmData, city: e.target.value})}
                  />
                ) : (
                  <span>{farmData.city || 'Not specified'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>📞 Contact Information</h4>
            <div className="detail-items">
              <div className="detail-item">
                <label>Phone:</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={farmData.phone}
                    onChange={(e) => setFarmData({...farmData, phone: e.target.value})}
                  />
                ) : (
                  <span>{farmData.phone || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{user?.email || 'Not specified'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>🌱 Farm Specifications</h4>
            <div className="detail-items">
              <div className="detail-item">
                <label>Farm Size:</label>
                {editMode ? (
                  <input
                    type="text"
                    value={farmData.farmSize}
                    onChange={(e) => setFarmData({...farmData, farmSize: e.target.value})}
                    placeholder="e.g., 5 acres"
                  />
                ) : (
                  <span>{farmData.farmSize || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-item">
                <label>Farming Type:</label>
                {editMode ? (
                  <select
                    value={farmData.farmingType}
                    onChange={(e) => setFarmData({...farmData, farmingType: e.target.value})}
                  >
                    <option value="organic">Organic</option>
                    <option value="conventional">Conventional</option>
                    <option value="hydroponic">Hydroponic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                ) : (
                  <span className="farming-type">
                    🌱 {farmData.farmingType?.charAt(0).toUpperCase() + farmData.farmingType?.slice(1) || 'Not specified'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>⏰ Operating Hours</h4>
            <div className="operating-hours">
              <div className="hours-item">
                <span>Monday - Friday:</span>
                <span>6:00 AM - 6:00 PM</span>
              </div>
              <div className="hours-item">
                <span>Saturday:</span>
                <span>6:00 AM - 4:00 PM</span>
              </div>
              <div className="hours-item">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="farm-actions">
            <button className="save-btn" onClick={handleSave}>
              💾 Save Changes
            </button>
            <button className="cancel-btn" onClick={() => setEditMode(false)}>
              ❌ Cancel
            </button>
          </div>
        )}

        <div className="farm-features">
          <div className="feature-card">
            <h4>🌿 Certifications</h4>
            <div className="certifications">
              <span className="cert-badge organic">🌱 Organic Certified</span>
              <span className="cert-badge quality">✅ Quality Assured</span>
              <span className="cert-badge local">🏠 Local Producer</span>
            </div>
          </div>
          
          <div className="feature-card">
            <h4>📊 Farm Statistics</h4>
            <div className="farm-stats">
              <div className="stat-item">
                <span className="stat-value">2.5</span>
                <span className="stat-label">Years Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">150+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">25</span>
                <span className="stat-label">Product Varieties</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SellerSettingsTab = ({ user }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    emailUpdates: true,
    smsNotifications: false,
    marketingEmails: false
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="enhanced-settings-tab">
      <div className="settings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
          <div className="header-content">
            <h2>⚙️ Account Settings</h2>
            <p>Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <div className="settings-nav">
            <button 
              className={`nav-item ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              👤 Personal Info
            </button>
            <button 
              className={`nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              🔒 Security
            </button>
            <button 
              className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              🔔 Notifications
            </button>
            <button 
              className={`nav-item ${activeSection === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveSection('payment')}
            >
              💳 Payment
            </button>
            <button 
              className={`nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveSection('privacy')}
            >
              🛡️ Privacy
            </button>
          </div>
        </div>

        <div className="settings-content">
          {activeSection === 'personal' && (
            <div className="settings-section">
              <h3>👤 Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue={user?.firstName} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue={user?.lastName} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user?.email} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue={user?.phone} />
                </div>
                <div className="form-group full-width">
                  <label>Username</label>
                  <input type="text" defaultValue={user?.username} />
                </div>
              </div>
              <button className="save-btn">💾 Save Changes</button>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <h3>🔒 Security Settings</h3>
              <div className="security-options">
                <div className="security-item">
                  <h4>Change Password</h4>
                  <p>Update your password to keep your account secure</p>
                  <button className="btn btn-outline">🔑 Change Password</button>
                </div>
                <div className="security-item">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                  <button className="btn btn-primary">🛡️ Enable 2FA</button>
                </div>
                <div className="security-item">
                  <h4>Login Sessions</h4>
                  <p>Manage your active login sessions</p>
                  <button className="btn btn-outline">👁️ View Sessions</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h3>🔔 Notification Preferences</h3>
              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Order Alerts</h4>
                    <p>Get notified when you receive new orders</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.orderAlerts}
                      onChange={() => handleNotificationChange('orderAlerts')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Email Updates</h4>
                    <p>Receive important updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.emailUpdates}
                      onChange={() => handleNotificationChange('emailUpdates')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>SMS Notifications</h4>
                    <p>Get text messages for urgent updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.smsNotifications}
                      onChange={() => handleNotificationChange('smsNotifications')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Marketing Emails</h4>
                    <p>Receive promotional offers and tips</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.marketingEmails}
                      onChange={() => handleNotificationChange('marketingEmails')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="settings-section">
              <h3>💳 Payment Settings</h3>
              <div className="payment-options">
                <div className="payment-method">
                  <h4>Bank Account</h4>
                  <p>Add your bank account for receiving payments</p>
                  <div className="bank-info">
                    <input type="text" placeholder="Bank Name" />
                    <input type="text" placeholder="Account Number" />
                    <input type="text" placeholder="Account Holder Name" />
                  </div>
                  <button className="btn btn-primary">💾 Save Bank Details</button>
                </div>
                
                <div className="payment-method">
                  <h4>Digital Wallets</h4>
                  <p>Connect your digital wallet accounts</p>
                  <div className="wallet-options">
                    <button className="wallet-btn khalti">📱 Connect Khalti</button>
                    <button className="wallet-btn esewa">💳 Connect eSewa</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="settings-section">
              <h3>🛡️ Privacy Settings</h3>
              <div className="privacy-options">
                <div className="privacy-item">
                  <h4>Profile Visibility</h4>
                  <p>Control who can see your farm profile</p>
                  <select className="privacy-select">
                    <option value="public">Public - Everyone can see</option>
                    <option value="customers">Customers only</option>
                    <option value="private">Private - Hidden</option>
                  </select>
                </div>
                
                <div className="privacy-item">
                  <h4>Data Export</h4>
                  <p>Download a copy of your data</p>
                  <button className="btn btn-outline">📥 Export Data</button>
                </div>
                
                <div className="privacy-item">
                  <h4>Account Deletion</h4>
                  <p>Permanently delete your account and data</p>
                  <button className="btn btn-danger">🗑️ Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Products Tab Component
const EnhancedProductsTab = ({ products, loading, onEditProduct, onDeleteProduct, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'stock':
        return b.stock - a.stock;
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  }) || [];

  // Get unique categories
  const categories = [...new Set(products?.map(p => p.category?.name).filter(Boolean))] || [];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="enhanced-products-tab">
      <div className="products-header">
        <div className="header-left">
          <h2>🥬 Your Products</h2>
          <p>Manage your fresh produce inventory</p>
        </div>
        <button className="add-product-btn primary" onClick={onAddProduct}>
          <span className="btn-icon">➕</span>
          Add New Product
        </button>
      </div>

      <div className="products-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div className="enhanced-product-card" key={product._id}>
              <div className="product-image-container">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="product-placeholder" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                  🥬
                </div>
                <div className="product-badges">
                  {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
                  {product.organic && <span className="badge organic">🌱 Organic</span>}
                  {product.stock === 0 && <span className="badge out-of-stock">❌ Out of Stock</span>}
                </div>
              </div>
              
              <div className="product-content">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-status">
                    <span className={`status-indicator ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? '🟢' : '🔴'}
                    </span>
                  </div>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Price:</span>
                    <span className="value price">Rs. {product.price?.toLocaleString()}/{product.unit}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Stock:</span>
                    <span className={`value stock ${product.stock === 0 ? 'zero' : product.stock < 10 ? 'low' : 'good'}`}>
                      {product.stock || 0} {product.unit}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Category:</span>
                    <span className="value category">{product.category?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Orders:</span>
                    <span className="value orders">{product.totalOrders || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="product-actions">
                <button 
                  className="action-btn edit" 
                  onClick={() => onEditProduct(product)}
                  title="Edit Product"
                >
                  ✏️ Edit
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => onDeleteProduct(product._id)}
                  title="Delete Product"
                >
                  🗑️ Delete
                </button>
                <button 
                  className="action-btn toggle" 
                  title={product.isActive ? 'Deactivate' : 'Activate'}
                >
                  {product.isActive ? '⏸️ Pause' : '▶️ Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products-state">
          <div className="empty-state-icon">📦</div>
          <h3>No Products Found</h3>
          <p>
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : "You haven't added any products yet. Start by adding your first product!"
            }
          </p>
          <button className="add-product-btn primary" onClick={onAddProduct}>
            <span className="btn-icon">➕</span>
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard