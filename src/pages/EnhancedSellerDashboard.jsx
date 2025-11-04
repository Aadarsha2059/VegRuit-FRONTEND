import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import LoadingSpinner from '../components/dashboard/LoadingSpinner'
import { categoryAPI } from '../services/categoryAPI'
import { productAPI } from '../services/productAPI'
import { orderAPI } from '../services/orderAPI'
import { STORAGE_KEYS } from '../services/authAPI'
import './EnhancedSellerDashboard.css'

const EnhancedSellerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'categories') {
      loadCategories()
    } else if (activeTab === 'products') {
      loadProducts()
    } else if (activeTab === 'orders') {
      loadOrders()
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [categoriesRes, productsRes, ordersRes] = await Promise.all([
        categoryAPI.getSellerCategories(token),
        productAPI.getSellerProducts(token, { limit: 5 }),
        orderAPI.getSellerOrders(token, { limit: 5 })
      ])

      setCategories(categoriesRes.success ? categoriesRes.data.categories : [])
      setProducts(productsRes.success ? productsRes.data.products : [])
      setOrders(ordersRes.success ? ordersRes.data.orders : [])

      const stats = {
        totalCategories: categoriesRes.success ? categoriesRes.data.categories.length : 0,
        totalProducts: productsRes.success ? productsRes.data.pagination.total : 0,
        activeProducts: productsRes.success ? productsRes.data.products.filter(p => p.isActive).length : 0,
        pendingOrders: ordersRes.success ? ordersRes.data.orders.filter(o => o.status === 'pending').length : 0,
        totalEarnings: ordersRes.success ? ordersRes.data.orders.reduce((sum, order) => sum + order.total, 0) : 0
      }

      setDashboardData({ stats, recentOrders: ordersRes.success ? ordersRes.data.orders : [] })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await categoryAPI.getSellerCategories(token)
      if (response.success) {
        setCategories(response.data.categories)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await productAPI.getSellerProducts(token)
      if (response.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await orderAPI.getSellerOrders(token)
      if (response.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await categoryAPI.createCategory(token, categoryData)
      if (response.success) {
        toast.success('Category created successfully!')
        loadCategories()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    }
  }

  const handleCreateProduct = async (productData) => {
    try {
      const response = await productAPI.createProduct(token, productData)
      if (response.success) {
        toast.success('Product created successfully!')
        loadProducts()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
    }
  }

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'categories', label: 'Categories', icon: '📂' },
    { key: 'products', label: 'Products', icon: '🍎' },
    { key: 'orders', label: 'Recent Orders', icon: '📦' },
    { key: 'earnings', label: 'Earnings', icon: '💰' },
    { key: 'customers', label: 'Customers', icon: '👥' },
    { key: 'inventory', label: 'Inventory', icon: '📋' },
    { key: 'farm', label: 'Farm', icon: '🏡' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      overview: 'Farm Dashboard Overview',
      categories: 'Category Management',
      products: 'Product Management',
      orders: 'Recent Orders & Customer Details',
      earnings: 'Earnings & Analytics',
      customers: 'Customer Management',
      inventory: 'Inventory Management',
      farm: 'Farm Settings',
      settings: 'Account Settings'
    }
    return titles[tab] || 'Seller Dashboard'
  }

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading..." />
    }

    switch (activeTab) {
      case 'overview':
        return <SellerOverviewTab user={user} data={dashboardData} />
      case 'categories':
        return <SellerCategoriesTab categories={categories} onCreateCategory={handleCreateCategory} />
      case 'products':
        return <SellerProductsTab products={products} categories={categories} onCreateProduct={handleCreateProduct} />
      case 'orders':
        return <SellerOrdersTab orders={orders} />
      case 'earnings':
        return <SellerEarningsTab data={dashboardData} />
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
    <DashboardLayout
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={onLogout}
      sidebarItems={sidebarItems}
      headerTitle={getTabTitle(activeTab)}
    >
      {renderTabContent()}
    </DashboardLayout>
  )
}

// Overview Tab
const SellerOverviewTab = ({ user, data }) => {
  if (!data) return <LoadingSpinner message="Loading overview..." />

  const { stats, recentOrders } = data

  return (
    <div className="seller-overview">
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome back, {user.firstName}! 🌱</h2>
          <p>Manage your farm and grow your business with VegRuit</p>
        </div>
        <div className="quick-actions">
          <button className="quick-action-btn primary">
            <span className="icon">📂</span>
            Manage Categories
          </button>
          <button className="quick-action-btn secondary">
            <span className="icon">🍎</span>
            Add Products
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Categories"
          value={stats.totalCategories}
          label="Active categories"
          icon="📂"
          color="primary"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          label={`${stats.activeProducts} active`}
          icon="🍎"
          color="success"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          label="Need attention"
          icon="📦"
          color="warning"
        />
        <StatCard
          title="Total Earnings"
          value={`Rs. ${stats.totalEarnings.toLocaleString()}`}
          label="This month"
          icon="💰"
          color="info"
        />
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Orders</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="orders-preview">
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 3).map((order) => (
                <div key={order._id} className="order-preview-card">
                  <div className="order-info">
                    <h4>Order #{order.orderNumber}</h4>
                    <p>{order.buyerName} • Rs. {order.total}</p>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Categories Tab
const SellerCategoriesTab = ({ categories, onCreateCategory }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: '#059669',
    image: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('icon', formData.icon)
    formDataToSend.append('color', formData.color)
    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }

    await onCreateCategory(formDataToSend)
    setShowForm(false)
    setFormData({ name: '', description: '', icon: '📦', color: '#059669', image: null })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h3>Category Management</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="category-form">
          <h4>Create New Category</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Category Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {formData.image && (
                <div className="image-preview">
                  <img 
                    src={URL.createObjectURL(formData.image)} 
                    alt="Preview" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category._id} className="category-card">
            <div className="category-visual">
              {category.image ? (
                <img 
                  src={`http://localhost:50011${category.image}`} 
                  alt={category.name}
                  className="category-image"
                />
              ) : (
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  {category.icon}
                </div>
              )}
            </div>
            <div className="category-info">
              <h4>{category.name}</h4>
              <p>{category.description}</p>
              <span className="product-count">{category.productCount} products</span>
            </div>
            <div className="category-actions">
              <button className="btn btn-outline">Edit</button>
              <button className="btn btn-outline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Products Tab
const SellerProductsTab = ({ products, categories, onCreateProduct }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    category: '',
    organic: false,
    images: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price)
    formDataToSend.append('unit', formData.unit)
    formDataToSend.append('stock', formData.stock)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('organic', formData.organic)
    
    // Append multiple images
    formData.images.forEach((image, index) => {
      formDataToSend.append('images', image)
    })

    await onCreateProduct(formDataToSend)
    setShowForm(false)
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      stock: '',
      category: '',
      organic: false,
      images: []
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData({ ...formData, images: files })
  }

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  return (
    <div className="products-tab">
      <div className="tab-header">
        <h3>Product Management</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="product-form">
          <h4>Create New Product</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Product Images (Max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file-input"
              />
              {formData.images.length > 0 && (
                <div className="image-previews">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`} 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (Rs.) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="kg">kg</option>
                  <option value="piece">piece</option>
                  <option value="bunch">bunch</option>
                  <option value="dozen">dozen</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.organic}
                  onChange={(e) => setFormData({ ...formData, organic: e.target.checked })}
                />
                Organic Product
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img src={`http://localhost:50011${product.images[0]}`} alt={product.name} />
              ) : (
                <div className="placeholder-image">🥬</div>
              )}
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-price">Rs. {product.price}/{product.unit}</p>
              <p className="product-stock">Stock: {product.stock} {product.unit}</p>
              <span className={`status ${product.status}`}>{product.status}</span>
              {product.organic && <span className="organic-badge">🌱 Organic</span>}
            </div>
            <div className="product-actions">
              <button className="btn btn-outline">Edit</button>
              <button className="btn btn-outline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Orders Tab
const SellerOrdersTab = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' },
      approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' },
      confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '✅' },
      processing: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '👨‍🍳' },
      shipped: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '🚚' },
      delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: '🎉' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' }
    };
    return statusMap[status] || statusMap.pending;
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('sellerToken') || authAPI.getAuthToken();
      if (!token) {
        toast.error('Please login to accept orders');
        return;
      }
      
      const response = await orderAPI.acceptOrder(token, orderId)
      if (response.success) {
        toast.success('Order accepted successfully!')
        loadOrders() // Reload orders to show updated status
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error accepting order:', error)
      toast.error('Failed to accept order')
    }
  }

  const handleRejectOrder = async (orderId, reason) => {
    try {
      const token = localStorage.getItem('sellerToken') || authAPI.getAuthToken();
      if (!token) {
        toast.error('Please login to reject orders');
        return;
      }
      
      const response = await orderAPI.rejectOrder(token, orderId, reason)
      if (response.success) {
        toast.success('Order rejected successfully!')
        loadOrders() // Reload orders to show updated status
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error rejecting order:', error)
      toast.error('Failed to reject order')
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('sellerToken') || authAPI.getAuthToken();
      if (!token) {
        toast.error('Please login to update order status');
        return;
      }
      
      const response = await orderAPI.updateOrderStatus(token, orderId, newStatus)
      if (response.success) {
        toast.success(`Order status updated to ${newStatus}`)
        loadOrders() // Reload orders to show updated status
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  return (
    <div className="orders-tab">
      <div className="tab-header">
        <div className="header-content">
          <h3>Recent Orders & Customer Details</h3>
          <p>Manage your orders and communicate with customers</p>
        </div>
        <div className="header-actions">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending">Pending ({orders.filter(o => o.status === 'pending').length})</option>
            <option value="confirmed">Confirmed ({orders.filter(o => o.status === 'confirmed').length})</option>
            <option value="processing">Processing ({orders.filter(o => o.status === 'processing').length})</option>
            <option value="shipped">Shipped ({orders.filter(o => o.status === 'shipped').length})</option>
            <option value="delivered">Delivered ({orders.filter(o => o.status === 'delivered').length})</option>
          </select>
        </div>
      </div>
      
      <div className="orders-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            return (
              <div key={order._id} className="enhanced-order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h4 className="order-number">#{order.orderNumber}</h4>
                    <p className="order-date">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`order-status-badge ${statusInfo.color}`}>
                    <span className="status-icon">{statusInfo.icon}</span>
                    <span className="status-text">{order.status}</span>
                  </div>
                </div>

                <div className="customer-section">
                  <div className="customer-header">
                    <h5>👤 Customer Information</h5>
                  </div>
                  <div className="customer-details">
                    <div className="customer-info">
                      <div className="info-row">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{order.buyerName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{order.buyerEmail}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{order.buyerPhone}</span>
                      </div>
                    </div>
                    <div className="customer-actions">
                      <button className="contact-btn email">
                        📧 Email
                      </button>
                      <button className="contact-btn phone">
                        📞 Call
                      </button>
                    </div>
                  </div>
                </div>

                <div className="delivery-section">
                  <div className="delivery-header">
                    <h5>🏠 Delivery Address</h5>
                  </div>
                  <div className="delivery-address">
                    <p>{order.deliveryAddress?.street}</p>
                    <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                    {order.deliveryAddress?.landmark && (
                      <p className="landmark">📍 {order.deliveryAddress.landmark}</p>
                    )}
                  </div>
                </div>

                <div className="order-items-section">
                  <div className="items-header">
                    <h5>🛒 Order Items ({order.items?.length || 0})</h5>
                    <span className="total-amount">Rs. {order.total}</span>
                  </div>
                  <div className="items-list">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="item-row">
                        <div className="item-info">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-quantity">×{item.quantity}</span>
                        </div>
                        <span className="item-price">Rs. {item.total}</span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-actions-section">
                  {order.status === 'pending' ? (
                    <div className="pending-actions">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleAcceptOrder(order._id)}
                      >
                        ✅ Accept Order
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRejectOrder(order._id, 'Order rejected by seller')}
                      >
                        ❌ Reject Order
                      </button>
                    </div>
                  ) : (
                    <div className="status-update">
                      <label>Update Status:</label>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="status-select"
                        disabled={order.status === 'rejected'}
                      >
                        <option value="approved">✅ Approved</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="processing">👨‍🍳 Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">🎉 Delivered</option>
                      </select>
                    </div>
                  )}
                  <div className="action-buttons">
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Full Details
                    </button>
                    <button className="btn btn-primary btn-sm">
                      💬 Message Customer
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="no-orders-state">
            <div className="no-orders-icon">📦</div>
            <h3>No orders found</h3>
            <p>
              {statusFilter === 'all' 
                ? "You haven't received any orders yet" 
                : `No ${statusFilter} orders found`}
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.orderNumber}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-section">
                <h4>Customer Information</h4>
                <div className="customer-full-details">
                  <p><strong>Name:</strong> {selectedOrder.buyerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.buyerEmail}</p>
                  <p><strong>Phone:</strong> {selectedOrder.buyerPhone}</p>
                  <p><strong>Address:</strong> {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}</p>
                </div>
              </div>
              <div className="modal-section">
                <h4>Order Items</h4>
                <div className="modal-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="modal-item">
                      <span>{item.productName}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>Rs. {item.total}</span>
                    </div>
                  ))}
                </div>
                <div className="modal-total">
                  <strong>Total: Rs. {selectedOrder.total}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Placeholder components
const SellerEarningsTab = ({ data }) => (
  <div className="earnings-tab">
    <h3>Earnings & Analytics</h3>
    <p>Earnings data: Rs. {data?.stats?.totalEarnings || 0}</p>
  </div>
)

const SellerCustomersTab = () => (
  <div className="customers-tab">
    <h3>Customer Management</h3>
    <p>Customer management features coming soon!</p>
  </div>
)

const SellerInventoryTab = ({ products }) => (
  <div className="inventory-tab">
    <h3>Inventory Management</h3>
    <p>Total products: {products.length}</p>
  </div>
)

const SellerFarmTab = ({ user }) => (
  <div className="farm-tab">
    <h3>Farm Settings</h3>
    <p>Farm: {user.farmName}</p>
    <p>Location: {user.farmLocation}</p>
  </div>
)

const SellerSettingsTab = ({ user }) => (
  <div className="settings-tab">
    <h3>Account Settings</h3>
    <p>Manage your account settings here</p>
  </div>
)

export default EnhancedSellerDashboard
