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
import NepaliWelcomeDialog from '../components/NepaliWelcomeDialog';
import NepaliCalendar from '../components/NepaliCalendar';
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
  }, [user, navigate]);

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
        return (
          <div className="products-tab">
            <div className="back-button-container">
              <button className="back-button" onClick={handleGoBack}>
                <FaArrowLeft /> Back
              </button>
            </div>
            <h2>Your Products</h2>
            {productsLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="products-list">
                {products.map(product => (
                  <div className="product-card" key={product._id}>
                    <div className="product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-meta">
                        <span className="product-price">Rs. {product.price?.toLocaleString()}</span>
                        <span className="product-stock">Stock: {product.stock || 0}</span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>You haven't added any products yet.</p>
                <button className="add-product-btn">Add Your First Product</button>
              </div>
            )}
          </div>
        );
      
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
        />
      case 'earnings':
        return <SellerEarningsTab earnings={dashboardData?.overview} />
      case 'customers':
        return <SellerCustomersTab />
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

// Category Card Component
const CategoryCard = ({ category, onEdit, onDelete }) => (
  <div className="category-card">
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

const SellerOrdersTab = ({ orders, loading, onUpdateStatus }) => {
  const [statusFilter, setStatusFilter] = useState('all')

  if (loading) return <LoadingSpinner message="Loading orders..." />

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase())

  const handleStatusUpdate = async (orderId, newStatus) => {
    await onUpdateStatus(orderId, newStatus)
  }

  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h3>Order Management</h3>
        <div className="order-filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <h4>Order #{order.id}</h4>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-customer">
                <p><strong>Customer:</strong> {order.customer}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
                <p><strong>Delivery:</strong> {order.deliveryAddress}</p>
              </div>
              <div className="order-items">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Rs. {item.price}</span>
                    <span>Total: Rs. {item.total}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: Rs. {order.total}</span>
                <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button className="btn btn-outline">View Details</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}

const SellerEarningsTab = ({ earnings }) => {
  if (!earnings) return <LoadingSpinner message="Loading earnings..." />

  return (
    <div className="earnings-tab">
      <h3>Earnings & Analytics</h3>
      <div className="earnings-overview">
        <StatCard
          title="Today's Earnings"
          value={`Rs. ${earnings.todayEarnings || 0}`}
          label="Today"
          icon="💰"
          color="success"
        />
        <StatCard
          title="This Week"
          value={`Rs. ${earnings.thisWeekEarnings || 0}`}
          label="Weekly"
          icon="📊"
        />
        <StatCard
          title="This Month"
          value={`Rs. ${earnings.thisMonthEarnings || 0}`}
          label="Monthly"
          icon="📈"
        />
        <StatCard
          title="Total Earnings"
          value={`Rs. ${earnings.totalEarnings || 0}`}
          label="All time"
          icon="🏆"
          color="info"
        />
      </div>
      <div className="earnings-chart">
        <h4>Earnings Trend</h4>
        <div className="chart-placeholder">
          <p>📊 Chart visualization coming soon</p>
          <small>Weekly and monthly earnings will be displayed here</small>
        </div>
      </div>
    </div>
  )
}

const SellerCustomersTab = () => (
  <div className="customers-tab">
    <h3>Customer Management</h3>
    <div className="customers-content">
      <div className="customer-stats">
        <StatCard
          title="Total Customers"
          value="28"
          label="All time"
          icon="👥"
        />
        <StatCard
          title="New This Month"
          value="5"
          label="New customers"
          icon="🆕"
          color="success"
        />
        <StatCard
          title="Repeat Customers"
          value="18"
          label="Loyal customers"
          icon="🔄"
          color="info"
        />
      </div>
      <div className="customers-list">
        <p>Customer analytics and management features coming soon!</p>
      </div>
    </div>
  </div>
)

const SellerInventoryTab = ({ products }) => (
  <div className="inventory-tab">
    <h3>Inventory Management</h3>
    <div className="inventory-overview">
      <div className="inventory-stats">
        <StatCard
          title="Total Products"
          value={products.length}
          label="In catalog"
          icon="📦"
        />
        <StatCard
          title="Active Products"
          value={products.filter(p => p.status === 'active').length}
          label="Currently selling"
          icon="✅"
          color="success"
        />
        <StatCard
          title="Low Stock Items"
          value={products.filter(p => p.status === 'low-stock' || p.stock < 10).length}
          label="Need restocking"
          icon="⚠️"
          color="warning"
        />
      </div>
      
      <div className="inventory-alerts">
        <h4>⚠️ Low Stock Alerts</h4>
        <div className="alerts-list">
          {products.filter(p => p.status === 'low-stock' || p.stock < 10).map(product => (
            <div key={product.id || product._id} className="alert-item">
              <span>{product.name} - Only {product.stock} {product.unit} left</span>
              <button className="btn btn-primary btn-sm">Restock</button>
            </div>
          ))}
          {products.filter(p => p.status === 'low-stock' || p.stock < 10).length === 0 && (
            <p>All products are well stocked! 🎉</p>
          )}
        </div>
      </div>
    </div>
  </div>
)

const SellerFarmTab = ({ user }) => (
  <div className="farm-tab">
    <h3>Farm Settings</h3>
    <div className="farm-info">
      <div className="farm-details">
        <h4>Farm Information</h4>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Farm Name:</label>
            <span>{user.farmName}</span>
          </div>
          <div className="detail-item">
            <label>Location:</label>
            <span>{user.farmLocation}</span>
          </div>
          <div className="detail-item">
            <label>City:</label>
            <span>{user.city}</span>
          </div>
          <div className="detail-item">
            <label>Phone:</label>
            <span>{user.phone}</span>
          </div>
        </div>
      </div>
      <div className="farm-actions">
        <button className="btn btn-primary">Edit Farm Details</button>
        <button className="btn btn-outline">Upload Farm Photos</button>
        <button className="btn btn-outline">Manage Farm Hours</button>
      </div>
    </div>
  </div>
)

const SellerSettingsTab = ({ user }) => (
  <div className="settings-tab">
    <h3>Account Settings</h3>
    <div className="settings-options">
      <div className="setting-option">
        <h4>Personal Information</h4>
        <p>Update your name, email, and phone number</p>
        <button className="btn btn-outline">Edit</button>
      </div>
      <div className="setting-option">
        <h4>Farm Information</h4>
        <p>Manage your farm details and location</p>
        <button className="btn btn-outline">Configure</button>
      </div>
      <div className="setting-option">
        <h4>Payment Settings</h4>
        <p>Configure your payment and banking details</p>
        <button className="btn btn-outline">Configure</button>
      </div>
      <div className="setting-option">
        <h4>Notifications</h4>
        <p>Manage your notification preferences</p>
        <button className="btn btn-outline">Configure</button>
      </div>
    </div>
  </div>
)

export default SellerDashboard