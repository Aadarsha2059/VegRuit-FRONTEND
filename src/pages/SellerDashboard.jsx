import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';
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
import '../styles/SellerDashboard.css';

const SellerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const { data: dashboardData, loading: dashboardLoading } = useSellerDashboard()
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useSellerProducts()
  const { orders, loading: ordersLoading, updateOrderStatus } = useSellerOrders()

  const handleLogout = () => {
    onLogout()
    navigate('/')
    toast.success('Logged out successfully!')
  }

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'products', label: 'Products', icon: '🍎' },
    { key: 'orders', label: 'Orders', icon: '📦' },
    { key: 'earnings', label: 'Earnings', icon: '💰' },
    { key: 'customers', label: 'Customers', icon: '👥' },
    { key: 'inventory', label: 'Inventory', icon: '📋' },
    { key: 'farm', label: 'Farm', icon: '🏡' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      overview: 'Farm Dashboard Overview',
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
    <DashboardLayout
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      sidebarItems={sidebarItems}
      headerTitle={getTabTitle(activeTab)}
    >
      {renderTabContent()}
    </DashboardLayout>
  )
}

// Seller-specific tab components
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

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    isActive: category?.isActive !== undefined ? category.isActive : true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(category?.image || '')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('isActive', formData.isActive)
      
      if (imageFile) {
        submitData.append('image', imageFile)
      }
      
      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
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
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
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
  }

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <h4>{category ? 'Edit Category' : 'Add New Category'}</h4>
      
      <div className="form-group">
        <label>Category Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={uploading}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          disabled={uploading}
        />
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
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Category preview" />
              <button type="button" onClick={removeImage} className="remove-image-btn">
                ✕
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
          Active Category
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Saving...' : (category ? 'Update Category' : 'Add Category')}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={uploading}>
          Cancel
        </button>
      </div>
    </form>
  )
}

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