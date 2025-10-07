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
    color: '#059669'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateCategory(formData)
    setShowForm(false)
    setFormData({ name: '', description: '', icon: '📦', color: '#059669' })
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
            <div className="category-icon" style={{ backgroundColor: category.color }}>
              {category.icon}
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
    organic: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateProduct(formData)
    setShowForm(false)
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      stock: '',
      category: '',
      organic: false
    })
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
                <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} />
              ) : (
                <div className="placeholder-image">🥬</div>
              )}
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-price">Rs. {product.price}/{product.unit}</p>
              <p className="product-stock">Stock: {product.stock} {product.unit}</p>
              <span className={`status ${product.status}`}>{product.status}</span>
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
  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h3>Order Management</h3>
      </div>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <div className="order-header">
              <h4>Order #{order.orderNumber}</h4>
              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="order-customer">
              <p><strong>Customer:</strong> {order.buyerName}</p>
              <p><strong>Email:</strong> {order.buyerEmail}</p>
            </div>
            <div className="order-items">
              {order.items?.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <span>{item.productName}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Rs. {item.price}</span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span>Total: Rs. {order.total}</span>
              <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
              <div className="order-actions">
                <select className="status-select">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button className="btn btn-outline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
