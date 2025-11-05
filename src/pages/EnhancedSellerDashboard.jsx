import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import LoadingSpinner from '../components/dashboard/LoadingSpinner'
import { categoryAPI } from '../services/categoryAPI'
import { productAPI } from '../services/productAPI'
import { orderAPI } from '../services/orderAPI'
import { authAPI, STORAGE_KEYS } from '../services/authAPI'
import BackgroundAnimation from '../components/BackgroundAnimation'
import { ConfirmDialog, FormDialog } from '../components/Dialog'
import './EnhancedSellerDashboard.css'

const EnhancedSellerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  
  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, type: '', item: null })
  const [editDialog, setEditDialog] = useState({ isOpen: false, type: '', item: null })
  const [editFormData, setEditFormData] = useState({})
  const [editLoading, setEditLoading] = useState(false)

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts()
    } else if (activeTab === 'categories') {
      loadCategories()
    } else if (activeTab === 'orders') {
      loadOrders()
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [categoriesRes, productsRes, ordersRes] = await Promise.all([
        categoryAPI.getSellerCategories(token),
        productAPI.getSellerProducts(token),
        orderAPI.getSellerOrders(token)
      ])

      const stats = {
        totalCategories: categoriesRes.success ? categoriesRes.data.categories.length : 0,
        totalProducts: productsRes.success ? productsRes.data.products.length : 0,
        totalOrders: ordersRes.success ? ordersRes.data.orders.length : 0,
        totalRevenue: ordersRes.success ? ordersRes.data.orders.reduce((sum, order) => sum + order.total, 0) : 0
      }

      setDashboardData({ stats, recentOrders: ordersRes.success ? ordersRes.data.orders.slice(0, 5) : [] })
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

  // Edit and Delete Functions
  const handleEditCategory = (category) => {
    setEditFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color
    })
    setEditDialog({ isOpen: true, type: 'category', item: category })
  }

  const handleEditProduct = (product) => {
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      organic: product.organic || false
    })
    setEditDialog({ isOpen: true, type: 'product', item: product })
  }

  const handleDeleteCategory = (category) => {
    setDeleteDialog({ 
      isOpen: true, 
      type: 'category', 
      item: category 
    })
  }

  const handleDeleteProduct = (product) => {
    setDeleteDialog({ 
      isOpen: true, 
      type: 'product', 
      item: product 
    })
  }

  const confirmDelete = async () => {
    const { type, item } = deleteDialog
    try {
      if (type === 'category') {
        const response = await categoryAPI.deleteCategory(token, item._id)
        if (response.success) {
          setCategories(prev => prev.filter(cat => cat._id !== item._id))
          toast.success('Category deleted successfully!')
        } else {
          toast.error(response.message || 'Failed to delete category')
        }
      } else if (type === 'product') {
        const response = await productAPI.deleteProduct(token, item._id)
        if (response.success) {
          setProducts(prev => prev.filter(prod => prod._id !== item._id))
          toast.success('Product deleted successfully!')
        } else {
          toast.error(response.message || 'Failed to delete product')
        }
      }
    } catch (error) {
      toast.error('Failed to delete item')
      console.error('Delete error:', error)
    }
  }

  const handleEditSubmit = async () => {
    const { type, item } = editDialog
    setEditLoading(true)
    
    try {
      if (type === 'category') {
        const response = await categoryAPI.updateCategory(token, item._id, editFormData)
        if (response.success) {
          setCategories(prev => prev.map(cat => 
            cat._id === item._id ? { ...cat, ...editFormData } : cat
          ))
          toast.success('Category updated successfully!')
          setEditDialog({ isOpen: false, type: '', item: null })
        } else {
          toast.error(response.message || 'Failed to update category')
        }
      } else if (type === 'product') {
        const response = await productAPI.updateProduct(token, item._id, editFormData)
        if (response.success) {
          setProducts(prev => prev.map(prod => 
            prod._id === item._id ? { ...prod, ...editFormData } : prod
          ))
          toast.success('Product updated successfully!')
          setEditDialog({ isOpen: false, type: '', item: null })
        } else {
          toast.error(response.message || 'Failed to update product')
        }
      }
    } catch (error) {
      toast.error('Failed to update item')
      console.error('Update error:', error)
    } finally {
      setEditLoading(false)
    }
  }

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('sellerToken') || authAPI.getAuthToken()
      if (!token) {
        toast.error('Please login to accept orders')
        return
      }
      
      const response = await orderAPI.updateOrderStatus(token, orderId, 'confirmed')
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: 'confirmed' } : order
        ))
        toast.success('Order accepted successfully!')
      } else {
        toast.error(response.message || 'Failed to accept order')
      }
    } catch (error) {
      console.error('Error accepting order:', error)
      toast.error('Failed to accept order')
    }
  }

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'categories', label: 'Categories', icon: '📂' },
    { key: 'products', label: 'Products', icon: '🥬' },
    { key: 'orders', label: 'Orders', icon: '📦' },
    { key: 'analytics', label: 'Analytics', icon: '📈' },
    { key: 'customers', label: 'Customers', icon: '👥' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      overview: 'Dashboard Overview',
      categories: 'Manage Categories',
      products: 'Manage Products',
      orders: 'Order Management',
      analytics: 'Sales Analytics',
      customers: 'Customer Management',
      reviews: 'Customer Reviews',
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
        return <CategoriesTab 
          categories={categories} 
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      case 'products':
        return <ProductsTab 
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      case 'orders':
        return <OrdersTab orders={orders} onAcceptOrder={handleAcceptOrder} />
      case 'analytics':
        return <AnalyticsTab />
      case 'customers':
        return <CustomersTab />
      case 'reviews':
        return <ReviewsTab />
      case 'settings':
        return <SellerSettingsTab user={user} />
      default:
        return <SellerOverviewTab user={user} data={dashboardData} />
    }
  }

  return (
    <>
      <BackgroundAnimation />
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: '', item: null })}
        onConfirm={confirmDelete}
        title={`Delete ${deleteDialog.type === 'category' ? 'Category' : 'Product'}`}
        message={`Are you sure you want to delete "${deleteDialog.item?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Edit Dialog */}
      <FormDialog
        isOpen={editDialog.isOpen}
        onClose={() => setEditDialog({ isOpen: false, type: '', item: null })}
        onSubmit={handleEditSubmit}
        title={`Edit ${editDialog.type === 'category' ? 'Category' : 'Product'}`}
        loading={editLoading}
      >
        {editDialog.type === 'category' && (
          <>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
              />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <input
                type="text"
                value={editFormData.icon || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Enter emoji icon (e.g., 🥬)"
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={editFormData.color || '#4caf50'}
                onChange={(e) => setEditFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </>
        )}

        {editDialog.type === 'product' && (
          <>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
              />
            </div>
            <div className="form-group">
              <label>Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={editFormData.price || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                placeholder="Enter price"
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select
                value={editFormData.unit || 'kg'}
                onChange={(e) => setEditFormData(prev => ({ ...prev, unit: e.target.value }))}
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="piece">Piece</option>
                <option value="bunch">Bunch</option>
                <option value="dozen">Dozen</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                value={editFormData.stock || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                placeholder="Enter stock quantity"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={editFormData.organic || false}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, organic: e.target.checked }))}
                />
                Organic Product
              </label>
            </div>
          </>
        )}
      </FormDialog>
    </>
  )
}

// Overview Tab
const SellerOverviewTab = ({ user, data }) => {
  if (!data) return <LoadingSpinner message="Loading overview..." />

  const { stats, recentOrders } = data

  return (
    <div className="seller-overview">
      <div className="welcome-section">
        <h2>Welcome back, {user.firstName}! 🌱</h2>
        <p>Here's what's happening with your farm today</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon="📂"
          color="#4caf50"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon="🥬"
          color="#2196f3"
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon="📦"
          color="#ff9800"
        />
        <StatCard
          title="Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="#9c27b0"
        />
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        {recentOrders.length > 0 ? (
          <div className="orders-list">
            {recentOrders.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-info">
                  <h4>Order #{order.orderNumber}</h4>
                  <p>{order.buyerName}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-total">
                  Rs. {order.total}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent orders</p>
        )}
      </div>
    </div>
  )
}

// Categories Tab
const CategoriesTab = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h3>📂 Manage Categories</h3>
        <button className="btn btn-primary">+ Add Category</button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category._id} className="category-card">
            <div className="category-header">
              <div className="category-icon" style={{ backgroundColor: category.color }}>
                {category.icon}
              </div>
              <div className="category-actions">
                <button onClick={() => onEdit(category)} className="edit-btn">✏️</button>
                <button onClick={() => onDelete(category)} className="delete-btn">🗑️</button>
              </div>
            </div>
            <div className="category-info">
              <h4>{category.name}</h4>
              <p>{category.description}</p>
              <div className="category-stats">
                <span>{category.productCount || 0} products</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Products Tab
const ProductsTab = ({ products, onEdit, onDelete }) => {
  return (
    <div className="products-tab">
      <div className="tab-header">
        <h3>🥬 Manage Products</h3>
        <button className="btn btn-primary">+ Add Product</button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img src={`http://localhost:5001${product.images[0]}`} alt={product.name} />
              ) : (
                <div className="placeholder-image">🥬</div>
              )}
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-price">Rs. {product.price}/{product.unit}</p>
              <p className="product-stock">Stock: {product.stock} {product.unit}</p>
              {product.organic && <span className="organic-badge">🌱 Organic</span>}
            </div>
            <div className="product-actions">
              <button onClick={() => onEdit(product)} className="edit-btn">✏️ Edit</button>
              <button onClick={() => onDelete(product)} className="delete-btn">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Orders Tab
const OrdersTab = ({ orders, onAcceptOrder }) => {
  const [statusFilter, setStatusFilter] = useState('all')

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' },
      confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '✅' },
      processing: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🔄' },
      shipped: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '🚚' },
      delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: '📦' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' }
    }
    return statusMap[status] || statusMap.pending
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h3>📦 Order Management</h3>
        <div className="status-filters">
          <button 
            className={statusFilter === 'all' ? 'active' : ''}
            onClick={() => setStatusFilter('all')}
          >
            All ({orders.length})
          </button>
          <button 
            className={statusFilter === 'pending' ? 'active' : ''}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status)
          return (
            <div key={order._id} className="enhanced-order-card">
              <div className="order-card-header">
                <div className="order-basic-info">
                  <h4>Order #{order.orderNumber}</h4>
                  <p className="buyer-name">👤 {order.buyerName}</p>
                  <p className="order-date">
                    📅 {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={`order-status-badge ${statusInfo.color}`}>
                  <span className="status-icon">{statusInfo.icon}</span>
                  <span className="status-text">{order.status}</span>
                </div>
              </div>
              
              <div className="order-items">
                <h5>Items ({order.items?.length || 0})</h5>
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.productName}</span>
                    <span>{item.quantity} {item.unit}</span>
                    <span>Rs. {item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  <strong>Total: Rs. {order.total}</strong>
                </div>
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => onAcceptOrder(order._id)}
                    >
                      ✅ Accept Order
                    </button>
                  )}
                  <button className="btn btn-outline">View Details</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Placeholder tabs
const AnalyticsTab = () => (
  <div className="analytics-tab">
    <h3>📈 Sales Analytics</h3>
    <p>Analytics dashboard coming soon...</p>
  </div>
)

const CustomersTab = () => (
  <div className="customers-tab">
    <h3>👥 Customer Management</h3>
    <p>Customer management features coming soon...</p>
  </div>
)

const ReviewsTab = () => (
  <div className="reviews-tab">
    <h3>⭐ Customer Reviews</h3>
    <p>Review management coming soon...</p>
  </div>
)

const SellerSettingsTab = ({ user }) => (
  <div className="settings-tab">
    <h3>⚙️ Account Settings</h3>
    <div className="settings-section">
      <h4>Farm Information</h4>
      <p><strong>Farm Name:</strong> {user.farmName}</p>
      <p><strong>Location:</strong> {user.farmLocation}</p>
    </div>
  </div>
)

export default EnhancedSellerDashboard