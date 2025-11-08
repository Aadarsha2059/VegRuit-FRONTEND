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
import { feedbackAPI } from '../services/feedbackAPI'
import { favoritesAPI } from '../services/favoritesAPI'
import BackgroundAnimation from '../components/BackgroundAnimation'
import { ConfirmDialog, FormDialog } from '../components/Dialog'
import FeedbackForm from '../components/FeedbackForm'
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
  
  // Feedback states
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackType, setFeedbackType] = useState('general_feedback')
  
  // Add/Create dialog states
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({ name: '', description: '', icon: '🥬', color: '#4caf50' })
  const [newProductData, setNewProductData] = useState({ name: '', description: '', price: '', unit: 'kg', stock: '', organic: false, category: '' })
  const [productImages, setProductImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  
  // Favorites states
  const [favorites, setFavorites] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())

  // Get token with fallback
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('sellerToken') || authAPI.getAuthToken()

  useEffect(() => {
    // Check if token exists
    if (!token) {
      toast.error('Please login to access the dashboard')
      navigate('/seller-login')
      return
    }
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts()
    } else if (activeTab === 'categories') {
      loadCategories()
    } else if (activeTab === 'orders') {
      loadOrders()
    } else if (activeTab === 'favorites') {
      loadFavorites()
    } else if (activeTab === 'customers') {
      loadOrders() // Load orders for customer data
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

  const loadFavorites = async () => {
    setLoading(true)
    try {
      const response = await favoritesAPI.getUserFavorites(token)
      if (response.success) {
        setFavorites(response.data.favorites)
        const ids = new Set(response.data.favorites.map(fav => fav.product._id))
        setFavoriteIds(ids)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (productId) => {
    try {
      if (favoriteIds.has(productId)) {
        const response = await favoritesAPI.removeFromFavorites(token, productId)
        if (response.success) {
          setFavoriteIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(productId)
            return newSet
          })
          setFavorites(prev => prev.filter(fav => fav.product._id !== productId))
          toast.success('Removed from favorites')
        }
      } else {
        const response = await favoritesAPI.addToFavorites(token, productId)
        if (response.success) {
          setFavoriteIds(prev => new Set([...prev, productId]))
          toast.success('Added to favorites!')
          if (activeTab === 'favorites') {
            loadFavorites()
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
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
        loadOrders() // Reload to get updated data
      } else {
        toast.error(response.message || 'Failed to accept order')
      }
    } catch (error) {
      console.error('Error accepting order:', error)
      toast.error('Failed to accept order')
    }
  }

  const handleViewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  const handleViewProductDetails = (productId) => {
    navigate(`/product/${productId}`)
  }

  const handleAddCategory = async () => {
    if (!newCategoryData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setEditLoading(true)
    try {
      const response = await categoryAPI.createCategory(token, newCategoryData)
      if (response.success) {
        setCategories(prev => [...prev, response.data.category])
        toast.success('Category created successfully!')
        setShowAddCategory(false)
        setNewCategoryData({ name: '', description: '', icon: '🥬', color: '#4caf50' })
        loadCategories() // Reload to get updated data
      } else {
        toast.error(response.message || 'Failed to create category')
      }
    } catch (error) {
      console.error('Create category error:', error)
      toast.error('Failed to create category')
    } finally {
      setEditLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (!newProductData.name.trim() || !newProductData.price || !newProductData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setEditLoading(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', newProductData.name)
      formData.append('description', newProductData.description)
      formData.append('price', newProductData.price)
      formData.append('unit', newProductData.unit)
      formData.append('stock', newProductData.stock)
      formData.append('category', newProductData.category)
      formData.append('organic', newProductData.organic)
      
      // Append images
      productImages.forEach((image) => {
        formData.append('images', image)
      })

      const response = await productAPI.createProduct(token, formData)
      if (response.success) {
        setProducts(prev => [...prev, response.data.product])
        toast.success('Product created successfully!')
        setShowAddProduct(false)
        setNewProductData({ name: '', description: '', price: '', unit: 'kg', stock: '', organic: false, category: '' })
        setProductImages([])
        setImagePreview([])
        loadProducts() // Reload to get updated data
      } else {
        toast.error(response.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('Create product error:', error)
      toast.error('Failed to create product')
    } finally {
      setEditLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    setProductImages(files)

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreview(previews)
  }

  const removeImage = (index) => {
    setProductImages(prev => prev.filter((_, i) => i !== index))
    setImagePreview(prev => prev.filter((_, i) => i !== index))
  }

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'categories', label: 'Categories', icon: '📂' },
    { key: 'products', label: 'Products', icon: '🥬' },
    { key: 'orders', label: 'Orders', icon: '📦' },
    { key: 'favorites', label: 'Favorites', icon: '❤️' },
    { key: 'analytics', label: 'Analytics', icon: '📈' },
    { key: 'customers', label: 'Customers', icon: '👥' },
    { key: 'feedback', label: 'Give Suggestions', icon: '💬' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      overview: 'Dashboard Overview',
      categories: 'Manage Categories',
      products: 'Manage Products',
      orders: 'Order Management',
      favorites: 'Favorite Products',
      analytics: 'Sales Analytics',
      customers: 'Customer Management',
      feedback: 'Give Suggestions & Feedback',
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
          onAdd={() => setShowAddCategory(true)}
        />
      case 'products':
        return <ProductsTab 
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAdd={() => setShowAddProduct(true)}
          onViewDetails={handleViewProductDetails}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      case 'orders':
        return <OrdersTab orders={orders} onAcceptOrder={handleAcceptOrder} onViewDetails={handleViewOrderDetails} />
      case 'favorites':
        return <SellerFavoritesTab favorites={favorites} onToggleFavorite={handleToggleFavorite} />
      case 'analytics':
        return <AnalyticsTab orders={orders} products={products} />
      case 'customers':
        return <CustomersTab orders={orders} />
      case 'feedback':
        return <SellerFeedbackTab onOpenFeedbackForm={(type) => {
          setFeedbackType(type)
          setShowFeedbackForm(true)
        }} />
      case 'settings':
        return <SellerSettingsTab user={user} onLogout={onLogout} />
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

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm
          feedbackType={feedbackType}
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={(feedback) => {
            toast.success('Thank you for your feedback!')
            setShowFeedbackForm(false)
          }}
        />
      )}

      {/* Add Category Dialog */}
      <FormDialog
        isOpen={showAddCategory}
        onClose={() => {
          setShowAddCategory(false)
          setNewCategoryData({ name: '', description: '', icon: '🥬', color: '#4caf50' })
        }}
        onSubmit={handleAddCategory}
        title="Add New Category"
        loading={editLoading}
      >
        <div className="form-group">
          <label>Category Name *</label>
          <input
            type="text"
            value={newCategoryData.name}
            onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={newCategoryData.description}
            onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter category description"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Icon (Emoji)</label>
          <input
            type="text"
            value={newCategoryData.icon}
            onChange={(e) => setNewCategoryData(prev => ({ ...prev, icon: e.target.value }))}
            placeholder="Enter emoji icon (e.g., 🥬)"
            maxLength="2"
          />
        </div>
        <div className="form-group">
          <label>Color</label>
          <input
            type="color"
            value={newCategoryData.color}
            onChange={(e) => setNewCategoryData(prev => ({ ...prev, color: e.target.value }))}
          />
        </div>
      </FormDialog>

      {/* Add Product Dialog */}
      <FormDialog
        isOpen={showAddProduct}
        onClose={() => {
          setShowAddProduct(false)
          setNewProductData({ name: '', description: '', price: '', unit: 'kg', stock: '', organic: false, category: '' })
          setProductImages([])
          setImagePreview([])
        }}
        onSubmit={handleAddProduct}
        title="Add New Product"
        loading={editLoading}
      >
        <div className="form-group">
          <label>Product Images (Max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          {imagePreview.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              {imagePreview.map((preview, index) => (
                <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            value={newProductData.name}
            onChange={(e) => setNewProductData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={newProductData.description}
            onChange={(e) => setNewProductData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter product description"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select
            value={newProductData.category}
            onChange={(e) => setNewProductData(prev => ({ ...prev, category: e.target.value }))}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Price (Rs.) *</label>
          <input
            type="number"
            step="0.01"
            value={newProductData.price}
            onChange={(e) => setNewProductData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            placeholder="Enter price"
            required
          />
        </div>
        <div className="form-group">
          <label>Unit *</label>
          <select
            value={newProductData.unit}
            onChange={(e) => setNewProductData(prev => ({ ...prev, unit: e.target.value }))}
          >
            <option value="kg">Kilogram (kg)</option>
            <option value="piece">Piece</option>
            <option value="bunch">Bunch</option>
            <option value="dozen">Dozen</option>
            <option value="liter">Liter</option>
          </select>
        </div>
        <div className="form-group">
          <label>Stock Quantity *</label>
          <input
            type="number"
            value={newProductData.stock}
            onChange={(e) => setNewProductData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
            placeholder="Enter stock quantity"
            required
          />
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newProductData.organic}
              onChange={(e) => setNewProductData(prev => ({ ...prev, organic: e.target.checked }))}
            />
            <span>Organic Product</span>
          </label>
        </div>
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
const CategoriesTab = ({ categories, onEdit, onDelete, onAdd }) => {
  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h3>📂 Manage Categories</h3>
        <button className="btn btn-primary" onClick={onAdd}>+ Add Category</button>
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
const ProductsTab = ({ products, onEdit, onDelete, onAdd, onViewDetails, favoriteIds, onToggleFavorite }) => {
  return (
    <div className="products-tab">
      <div className="tab-header">
        <h3>🥬 Manage Products</h3>
        <button className="btn btn-primary" onClick={onAdd}>+ Add Product</button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card-enhanced">
            <div className="product-image-wrapper">
              {product.images && product.images.length > 0 ? (
                <img src={`http://localhost:5001${product.images[0]}`} alt={product.name} className="product-image" />
              ) : (
                <div className="placeholder-image">🥬</div>
              )}
              <button 
                className={`favorite-icon-btn ${favoriteIds.has(product._id) ? 'active' : ''}`}
                onClick={() => onToggleFavorite(product._id)}
                title={favoriteIds.has(product._id) ? "Remove from favorites" : "Add to favorites"}
              >
                {favoriteIds.has(product._id) ? '❤️' : '🤍'}
              </button>
              {product.organic && <span className="organic-badge-overlay">🌱 Organic</span>}
            </div>
            <div className="product-info-detailed">
              <div className="product-header-section">
                <h4 className="product-title">{product.name}</h4>
                {product.category && (
                  <span className="category-tag">{product.category.name}</span>
                )}
              </div>
              <p className="product-description">{product.description || 'No description'}</p>
              <div className="product-meta-info">
                <div className="price-section">
                  <span className="product-price">Rs. {product.price}</span>
                  <span className="price-unit">/{product.unit}</span>
                </div>
                <div className="stock-section">
                  <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                    {product.stock === 0 ? '❌ Out of Stock' : `✓ ${product.stock} ${product.unit}`}
                  </span>
                </div>
              </div>
              <div className="product-stats">
                <span className="stat-item">⭐ {product.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="stat-item">💬 {product.totalReviews || 0} reviews</span>
                <span className="stat-item">📦 {product.totalOrders || 0} orders</span>
              </div>
            </div>
            <div className="product-actions-row">
              <button onClick={() => onViewDetails(product._id)} className="action-btn view-btn" title="View Details">
                👁️
              </button>
              <button onClick={() => onEdit(product)} className="action-btn edit-btn" title="Edit Product">
                ✏️
              </button>
              <button onClick={() => onDelete(product)} className="action-btn delete-btn" title="Delete Product">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Orders Tab
const OrdersTab = ({ orders, onAcceptOrder, onViewDetails }) => {
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
          const isAccepted = order.status !== 'pending' && order.status !== 'cancelled'
          
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
              
              {/* Customer Details - Show for accepted orders */}
              {isAccepted && (
                <div className="customer-details-section">
                  <h5 className="section-title">📋 Customer Details</h5>
                  <div className="customer-info-grid">
                    <div className="info-item">
                      <span className="info-label">👤 Name:</span>
                      <span className="info-value">{String(order.buyerName || 'N/A')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📧 Email:</span>
                      <span className="info-value">{String(order.buyerEmail || 'N/A')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📱 Phone:</span>
                      <span className="info-value">{String(order.buyerPhone || 'N/A')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📍 Address:</span>
                      <span className="info-value">
                        {(() => {
                          if (!order.deliveryAddress) return 'N/A';
                          if (typeof order.deliveryAddress === 'string') return order.deliveryAddress;
                          if (typeof order.deliveryAddress === 'object') {
                            const parts = [
                              order.deliveryAddress.street,
                              order.deliveryAddress.city,
                              order.deliveryAddress.state,
                              order.deliveryAddress.postalCode
                            ].filter(Boolean);
                            return parts.length > 0 ? parts.join(', ') : 'N/A';
                          }
                          return 'N/A';
                        })()}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">🏙️ City:</span>
                      <span className="info-value">
                        {(() => {
                          if (order.buyerCity) return String(order.buyerCity);
                          if (order.deliveryAddress && typeof order.deliveryAddress === 'object') {
                            return String(order.deliveryAddress.city || 'N/A');
                          }
                          return 'N/A';
                        })()}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">💳 Payment:</span>
                      <span className="info-value">{String(order.paymentMethod || 'COD')}</span>
                    </div>
                  </div>
                </div>
              )}
              
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
                  <button className="btn btn-outline" onClick={() => onViewDetails(order._id)}>👁️ View Details</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Seller Favorites Tab
const SellerFavoritesTab = ({ favorites, onToggleFavorite }) => {
  return (
    <div className="favorites-tab">
      <div className="tab-header">
        <h3>❤️ Favorite Products</h3>
        <p>Products you've marked as favorites for quick access</p>
      </div>

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((favorite) => {
            const product = favorite.product
            if (!product) return null
            
            return (
              <div key={favorite._id} className="favorite-card">
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img src={`http://localhost:5001${product.images[0]}`} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">🥬</div>
                  )}
                  <button 
                    className="remove-favorite-btn"
                    onClick={() => onToggleFavorite(product._id)}
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-price">Rs. {product.price}/{product.unit}</p>
                  <p className="product-stock">Stock: {product.stock} {product.unit}</p>
                  {product.organic && <span className="organic-badge">🌱 Organic</span>}
                  {product.category && (
                    <span className="category-badge">{product.category.name}</span>
                  )}
                </div>
                <div className="product-actions">
                  <button 
                    className="view-btn"
                    onClick={() => window.open(`/product/${product._id}`, '_blank')}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-favorites">
          <div className="empty-icon">❤️</div>
          <h4>No Favorites Yet</h4>
          <p>Browse products and add them to your favorites for quick access!</p>
        </div>
      )}
    </div>
  )
}

// Analytics Tab
const AnalyticsTab = ({ orders, products }) => {
  // Calculate analytics data
  const analytics = React.useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    
    // Revenue by month (last 6 months)
    const monthlyRevenue = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (order.total || 0);
    });
    
    // Top selling products
    const productSales = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        const productId = item.product?._id || item.productId;
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.productName || item.product?.name || 'Unknown',
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity || 0;
          productSales[productId].revenue += (item.price * item.quantity) || 0;
        }
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Order status distribution
    const statusDistribution = {
      pending: pendingOrders,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: completedOrders,
      cancelled: cancelledOrders
    };
    
    return {
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      monthlyRevenue: Object.entries(monthlyRevenue).slice(-6),
      topProducts,
      statusDistribution,
      totalProducts: products.length,
      lowStockProducts: products.filter(p => p.stock < 10).length
    };
  }, [orders, products]);

  return (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h3>📈 Sales Analytics</h3>
        <p>Comprehensive overview of your business performance</p>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <span className="metric-label">Total Revenue</span>
            <span className="metric-value">Rs. {analytics.totalRevenue.toLocaleString()}</span>
            <span className="metric-trend positive">↑ All time</span>
          </div>
        </div>
        
        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <span className="metric-label">Total Orders</span>
            <span className="metric-value">{orders.length}</span>
            <span className="metric-trend">{analytics.completedOrders} completed</span>
          </div>
        </div>
        
        <div className="metric-card average">
          <div className="metric-icon">💵</div>
          <div className="metric-content">
            <span className="metric-label">Avg Order Value</span>
            <span className="metric-value">Rs. {Math.round(analytics.averageOrderValue).toLocaleString()}</span>
            <span className="metric-trend">Per order</span>
          </div>
        </div>
        
        <div className="metric-card products">
          <div className="metric-icon">🥬</div>
          <div className="metric-content">
            <span className="metric-label">Total Products</span>
            <span className="metric-value">{analytics.totalProducts}</span>
            <span className="metric-trend warning">{analytics.lowStockProducts} low stock</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Revenue Chart */}
        <div className="chart-card">
          <h4>📊 Monthly Revenue (Last 6 Months)</h4>
          <div className="bar-chart">
            {analytics.monthlyRevenue.map(([month, revenue]) => {
              const maxRevenue = Math.max(...analytics.monthlyRevenue.map(([, r]) => r));
              const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
              return (
                <div key={month} className="bar-item">
                  <div className="bar-wrapper">
                    <div className="bar" style={{ height: `${height}%` }}>
                      <span className="bar-value">Rs. {revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="bar-label">{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="chart-card">
          <h4>📈 Order Status Distribution</h4>
          <div className="status-chart">
            {Object.entries(analytics.statusDistribution).map(([status, count]) => {
              const total = orders.length;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const statusColors = {
                pending: '#f59e0b',
                confirmed: '#3b82f6',
                processing: '#8b5cf6',
                shipped: '#6366f1',
                delivered: '#10b981',
                cancelled: '#ef4444'
              };
              return (
                <div key={status} className="status-item">
                  <div className="status-info">
                    <span className="status-name">{status}</span>
                    <span className="status-count">{count} orders</span>
                  </div>
                  <div className="status-bar-bg">
                    <div 
                      className="status-bar-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: statusColors[status]
                      }}
                    />
                  </div>
                  <span className="status-percentage">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="top-products-section">
        <h4>🏆 Top Selling Products</h4>
        <div className="top-products-list">
          {analytics.topProducts.map((product, index) => (
            <div key={index} className="top-product-item">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                <span className="product-stats">
                  {product.quantity} units sold • Rs. {product.revenue.toLocaleString()}
                </span>
              </div>
              <div className="product-revenue">
                Rs. {product.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CustomersTab = ({ orders }) => {
  // Extract unique customers from orders
  const customers = React.useMemo(() => {
    const customerMap = new Map();
    
    orders.forEach(order => {
      const customerId = order.buyer?._id || order.buyerId;
      if (customerId && !customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: order.buyerName || 'Unknown',
          email: order.buyerEmail || 'N/A',
          phone: order.buyerPhone || 'N/A',
          city: order.buyerCity || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.orderDate
        });
      }
      
      // Update customer stats
      if (customerId && customerMap.has(customerId)) {
        const customer = customerMap.get(customerId);
        customer.totalOrders += 1;
        customer.totalSpent += order.total || 0;
        
        // Update last order date if this order is more recent
        if (new Date(order.orderDate) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.orderDate;
        }
      }
    });
    
    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <div className="customers-tab">
      <div className="tab-header">
        <h3>👥 Customer Management</h3>
        <div className="customers-stats">
          <span className="stat-badge">Total Customers: {customers.length}</span>
        </div>
      </div>

      {customers.length > 0 ? (
        <div className="customers-list">
          {customers.map((customer, index) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-rank">#{index + 1}</div>
              <div className="customer-info-section">
                <div className="customer-header">
                  <div className="customer-avatar">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-details">
                    <h4 className="customer-name">{customer.name}</h4>
                    <div className="customer-contact">
                      <span className="contact-item">📧 {customer.email}</span>
                      <span className="contact-item">📱 {customer.phone}</span>
                      <span className="contact-item">🏙️ {customer.city}</span>
                    </div>
                  </div>
                </div>
                <div className="customer-stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Orders</span>
                    <span className="stat-value">{customer.totalOrders}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Spent</span>
                    <span className="stat-value">Rs. {customer.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Order</span>
                    <span className="stat-value">
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Order Value</span>
                    <span className="stat-value">
                      Rs. {Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-customers">
          <div className="empty-icon">👥</div>
          <h4>No Customers Yet</h4>
          <p>Customers will appear here once you receive orders</p>
        </div>
      )}
    </div>
  );
}

const ReviewsTab = () => (
  <div className="reviews-tab">
    <h3>⭐ Customer Reviews</h3>
    <p>Review management coming soon...</p>
  </div>
)

const SellerFeedbackTab = ({ onOpenFeedbackForm }) => {
  const [myFeedbacks, setMyFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  useEffect(() => {
    loadMyFeedbacks()
  }, [])

  const loadMyFeedbacks = async () => {
    setLoading(true)
    try {
      const response = await feedbackAPI.getUserFeedbacks(token)
      if (response.success) {
        setMyFeedbacks(response.data.feedbacks)
      }
    } catch (error) {
      console.error('Load feedbacks error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'status-pending', label: 'Pending', icon: '⏳' },
      in_progress: { color: 'status-processing', label: 'In Progress', icon: '🔄' },
      resolved: { color: 'status-success', label: 'Resolved', icon: '✅' },
      closed: { color: 'status-closed', label: 'Closed', icon: '🔒' }
    }
    return badges[status] || badges.pending
  }

  const getFeedbackTypeLabel = (type) => {
    const labels = {
      general_feedback: 'General Feedback',
      product_feedback: 'Product Feedback',
      seller_feedback: 'Platform Feedback',
      system_complaint: 'System Complaint'
    }
    return labels[type] || type
  }

  return (
    <div className="feedback-tab">
      <div className="feedback-header">
        <div className="header-content">
          <h2>💬 Give Suggestions & Feedback</h2>
          <p>Share your experience and help us improve the platform</p>
        </div>
      </div>

      <div className="feedback-actions-grid">
        <div className="feedback-action-card" onClick={() => onOpenFeedbackForm('general_feedback')}>
          <div className="action-icon">💬</div>
          <h4>General Feedback</h4>
          <p>Share your overall experience with TarkariShop platform</p>
          <button className="btn btn-primary">Give Feedback</button>
        </div>

        <div className="feedback-action-card" onClick={() => onOpenFeedbackForm('seller_feedback')}>
          <div className="action-icon">⭐</div>
          <h4>Platform Suggestions</h4>
          <p>Suggest improvements for sellers and the platform</p>
          <button className="btn btn-primary">Give Suggestions</button>
        </div>

        <div className="feedback-action-card" onClick={() => onOpenFeedbackForm('system_complaint')}>
          <div className="action-icon">📝</div>
          <h4>Report Issue</h4>
          <p>Report technical issues or problems with the platform</p>
          <button className="btn btn-warning">Report Issue</button>
        </div>
      </div>

      <div className="my-feedbacks-section">
        <h3>My Feedback History</h3>
        {loading ? (
          <div className="loading-state">Loading feedbacks...</div>
        ) : myFeedbacks.length > 0 ? (
          <div className="feedbacks-list">
            {myFeedbacks.map((feedback) => {
              const statusBadge = getStatusBadge(feedback.status)
              return (
                <div key={feedback._id} className="feedback-card">
                  <div className="feedback-card-header">
                    <div className="feedback-type-badge">
                      {getFeedbackTypeLabel(feedback.feedbackType)}
                    </div>
                    <div className={`feedback-status-badge ${statusBadge.color}`}>
                      <span>{statusBadge.icon}</span>
                      <span>{statusBadge.label}</span>
                    </div>
                  </div>
                  <div className="feedback-card-body">
                    <h4>{feedback.subject}</h4>
                    <p>{feedback.message}</p>
                    {feedback.rating && (
                      <div className="feedback-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`star ${star <= feedback.rating ? 'filled' : ''}`}>
                            ★
                          </span>
                        ))}
                        <span className="rating-text">({feedback.rating}/5)</span>
                      </div>
                    )}
                    <div className="feedback-date">
                      Submitted on {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  {feedback.adminResponse && (
                    <div className="admin-response">
                      <h5>📢 Admin Response:</h5>
                      <p>{feedback.adminResponse.message}</p>
                      <small>
                        Responded on {new Date(feedback.adminResponse.respondedAt).toLocaleDateString()}
                      </small>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h4>No Feedback Yet</h4>
            <p>You haven't submitted any feedback yet.</p>
            <p>Share your experience to help us improve!</p>
          </div>
        )}
      </div>
    </div>
  )
}

const SellerSettingsTab = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    farmName: user?.farmName || '',
    farmLocation: user?.farmLocation || '',
    city: user?.city || ''
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
      toast.success('Logged out successfully!');
    }
  };

  return (
    <div className="settings-tab">
      <div className="settings-header">
        <h3>⚙️ Account Settings</h3>
        <p>Manage your account and farm information</p>
      </div>

      {/* Profile Section */}
      <div className="settings-card">
        <div className="card-header">
          <h4>👤 Profile Information</h4>
          <button className="edit-btn-small" onClick={() => setEditMode(!editMode)}>
            {editMode ? '❌ Cancel' : '✏️ Edit'}
          </button>
        </div>
        <div className="settings-grid">
          <div className="setting-item">
            <label>First Name</label>
            {editMode ? (
              <input 
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            ) : (
              <span className="setting-value">{user?.firstName || 'N/A'}</span>
            )}
          </div>
          <div className="setting-item">
            <label>Last Name</label>
            {editMode ? (
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            ) : (
              <span className="setting-value">{user?.lastName || 'N/A'}</span>
            )}
          </div>
          <div className="setting-item">
            <label>Email</label>
            <span className="setting-value">{user?.email || 'N/A'}</span>
          </div>
          <div className="setting-item">
            <label>Phone</label>
            {editMode ? (
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            ) : (
              <span className="setting-value">{user?.phone || 'N/A'}</span>
            )}
          </div>
        </div>
        {editMode && (
          <div className="card-actions">
            <button className="btn btn-primary">💾 Save Changes</button>
          </div>
        )}
      </div>

      {/* Farm Information */}
      <div className="settings-card">
        <div className="card-header">
          <h4>🌾 Farm Information</h4>
        </div>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Farm Name</label>
            {editMode ? (
              <input 
                type="text" 
                value={formData.farmName}
                onChange={(e) => setFormData({...formData, farmName: e.target.value})}
              />
            ) : (
              <span className="setting-value">{user?.farmName || 'N/A'}</span>
            )}
          </div>
          <div className="setting-item">
            <label>Farm Location</label>
            {editMode ? (
              <input 
                type="text" 
                value={formData.farmLocation}
                onChange={(e) => setFormData({...formData, farmLocation: e.target.value})}
              />
            ) : (
              <span className="setting-value">{user?.farmLocation || 'N/A'}</span>
            )}
          </div>
          <div className="setting-item">
            <label>City</label>
            {editMode ? (
              <input 
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            ) : (
              <span className="setting-value">{user?.city || 'N/A'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="settings-card danger-zone">
        <div className="card-header">
          <h4>🔐 Account Actions</h4>
        </div>
        <div className="action-buttons">
          <button className="btn btn-outline">🔑 Change Password</button>
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Logout from Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnhancedSellerDashboard