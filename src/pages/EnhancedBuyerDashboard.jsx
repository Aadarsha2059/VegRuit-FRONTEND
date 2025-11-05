import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import LoadingSpinner from '../components/dashboard/LoadingSpinner'
import { cartAPI } from '../services/cartAPI'
import { orderAPI } from '../services/orderAPI'
import { productAPI } from '../services/productAPI'
import { categoryAPI } from '../services/categoryAPI'
import { authAPI, STORAGE_KEYS } from '../services/authAPI'
import { reviewAPI } from '../services/reviewAPI'
import BackgroundAnimation from '../components/BackgroundAnimation'
import ReviewForm from '../components/ReviewForm'
import './EnhancedBuyerDashboard.css'

const EnhancedBuyerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState(null)
  const [orders, setOrders] = useState([])
  const [reviewableProducts, setReviewableProducts] = useState([])
  const [myReviews, setMyReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts()
    } else if (activeTab === 'cart') {
      loadCart()
    } else if (activeTab === 'orders') {
      loadOrders()
    } else if (activeTab === 'reviews') {
      loadReviewableProducts()
      loadMyReviews()
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [productsRes, categoriesRes, cartRes, ordersRes] = await Promise.all([
        productAPI.getFeaturedProducts(8),
        categoryAPI.getPublicCategories(),
        cartAPI.getCart(token),
        orderAPI.getBuyerOrders(token, { limit: 5 })
      ])

      setProducts(productsRes.success ? productsRes.data.products : [])
      setCategories(categoriesRes.success ? categoriesRes.data.categories : [])
      setCart(cartRes.success ? cartRes.data.cart : null)
      setOrders(ordersRes.success ? ordersRes.data.orders : [])

      // Calculate dashboard stats
      const stats = {
        totalOrders: ordersRes.success ? ordersRes.data.pagination.total : 0,
        cartItems: cartRes.success ? cartRes.data.cart.totalItems : 0,
        totalSpent: ordersRes.success ? ordersRes.data.orders.reduce((sum, order) => sum + order.total, 0) : 0,
        favoriteItems: 0 // Will be implemented later
      }

      setDashboardData({ stats, recentOrders: ordersRes.success ? ordersRes.data.orders : [] })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await productAPI.getPublicProducts({ limit: 20 })
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

  const loadCart = async () => {
    setLoading(true)
    try {
      const response = await cartAPI.getCart(token)
      if (response.success) {
        setCart(response.data.cart)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      const response = await orderAPI.getBuyerOrders(token)
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

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addToCart(token, productId, quantity)
      if (response.success) {
        toast.success('Product added to cart!')
        setCart(response.data.cart)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add product to cart')
    }
  }

  const handleUpdateCartItem = async (productId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem(token, productId, quantity)
      if (response.success) {
        setCart(response.data.cart)
        toast.success('Cart updated!')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
    }
  }

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(token, productId)
      if (response.success) {
        setCart(response.data.cart)
        toast.success('Item removed from cart!')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item from cart')
    }
  }

  const handleClearCart = async () => {
    try {
      const response = await cartAPI.clearCart(token)
      if (response.success) {
        setCart(response.data.cart)
        toast.success('Cart cleared!')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  const handleCreateOrder = async (orderData) => {
    try {
      const response = await orderAPI.createOrder(token, orderData)
      if (response.success) {
        toast.success('Order created successfully!')
        setCart({ totalItems: 0, totalValue: 0, items: [] })
        loadOrders()
        setActiveTab('orders')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to create order')
    }
  }

  // Review Functions
  const loadReviewableProducts = async () => {
    try {
      const response = await reviewAPI.getReviewableProducts(token)
      if (response.success) {
        setReviewableProducts(response.data.reviewableItems)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error loading reviewable products:', error)
      toast.error('Failed to load reviewable products')
    }
  }

  const loadMyReviews = async () => {
    try {
      const response = await reviewAPI.getBuyerReviews(token)
      if (response.success) {
        setMyReviews(response.data.reviews)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Failed to load your reviews')
    }
  }

  const handleWriteReview = (product) => {
    setSelectedProduct(product)
    setShowReviewForm(true)
  }

  const handleReviewSubmitted = (newReview) => {
    setMyReviews(prev => [newReview, ...prev])
    setReviewableProducts(prev => prev.filter(p => 
      !(p.productId === newReview.product && p.orderId === newReview.order)
    ))
    toast.success('Review submitted successfully!')
  }

  const handleConfirmReceipt = async (orderId) => {
    try {
      const response = await orderAPI.confirmOrderReceipt(token, orderId)
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: 'received', receivedAt: new Date() } : order
        ))
        toast.success('Order receipt confirmed! You can now write reviews.')
        // Reload reviewable products
        loadReviewableProducts()
      } else {
        toast.error(response.message || 'Failed to confirm receipt')
      }
    } catch (error) {
      console.error('Error confirming receipt:', error)
      toast.error('Failed to confirm receipt')
    }
  }

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'products', label: 'Browse Products', icon: '🛒' },
    { key: 'cart', label: 'Shopping Cart', icon: '🛍️' },
    { key: 'orders', label: 'Order History', icon: '📦' },
    { key: 'favorites', label: 'Favorites', icon: '❤️' },
    { key: 'payments', label: 'Payments', icon: '💳' },
    { key: 'delivery', label: 'Delivery', icon: '🚚' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      overview: 'Dashboard Overview',
      products: 'Browse Fresh Products',
      cart: 'Shopping Cart',
      orders: 'Order History & Tracking',
      favorites: 'Favorite Items',
      payments: 'Payment Methods',
      delivery: 'Delivery Addresses',
      reviews: 'My Reviews & Ratings',
      profile: 'My Profile',
      settings: 'Account Settings'
    }
    return titles[tab] || 'Buyer Dashboard'
  }

  const renderTabContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading..." />
    }

    switch (activeTab) {
      case 'overview':
        return <BuyerOverviewTab user={user} data={dashboardData} products={products} />
      case 'products':
        return <BuyerProductsTab products={products} categories={categories} onAddToCart={handleAddToCart} />
      case 'cart':
        return <BuyerCartTab cart={cart} onUpdateItem={handleUpdateCartItem} onRemoveItem={handleRemoveFromCart} onClearCart={handleClearCart} onCreateOrder={handleCreateOrder} />
      case 'orders':
        return <BuyerOrdersTab orders={orders} onConfirmReceipt={handleConfirmReceipt} />
      case 'favorites':
        return <BuyerFavoritesTab />
      case 'payments':
        return <BuyerPaymentsTab />
      case 'delivery':
        return <BuyerDeliveryTab user={user} />
      case 'reviews':
        return <BuyerReviewsTab 
          reviewableProducts={reviewableProducts}
          myReviews={myReviews}
          onWriteReview={handleWriteReview}
        />
      case 'profile':
        return <BuyerProfileTab user={user} />
      case 'settings':
        return <BuyerSettingsTab user={user} />
      default:
        return <BuyerOverviewTab user={user} data={dashboardData} products={products} />
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

      {/* Review Form Modal */}
      {showReviewForm && selectedProduct && (
        <ReviewForm
          product={selectedProduct}
          onClose={() => {
            setShowReviewForm(false)
            setSelectedProduct(null)
          }}
          onSubmit={handleReviewSubmitted}
        />
      )}
    </>
  )
}

// Enhanced Overview Tab Component
const BuyerOverviewTab = ({ user, data, products }) => {
  if (!data) return <LoadingSpinner message="Loading overview..." />

  const { stats, recentOrders } = data

  return (
    <div className="buyer-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome back, {user.firstName}! 🌱</h2>
          <p>Ready to discover fresh, organic produce from local farmers?</p>
        </div>
        <div className="quick-actions">
          <button className="quick-action-btn primary">
            <span className="icon">🛒</span>
            Browse Products
          </button>
          <button className="quick-action-btn secondary">
            <span className="icon">📦</span>
            Track Orders
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          label="All time"
          icon="📦"
          color="primary"
          trend="up"
          trendValue="+2 this month"
        />
        <StatCard
          title="Cart Items"
          value={stats.cartItems}
          label="Currently in cart"
          icon="🛍️"
          color="info"
        />
        <StatCard
          title="Total Spent"
          value={`Rs. ${stats.totalSpent.toLocaleString()}`}
          label="This month"
          icon="💰"
          color="success"
          trend="up"
          trendValue="+15%"
        />
        <StatCard
          title="Money Saved"
          value="Rs. 450"
          label="vs market price"
          icon="💸"
          color="warning"
          trend="up"
          trendValue="+8%"
        />
      </div>

      {/* Dashboard Sections */}
      <div className="dashboard-sections">
        {/* Recent Orders */}
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
                    <p>{order.items?.length || 0} items • Rs. {order.total}</p>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-actions-mini">
                    <span className="order-date">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/order-details/${order._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No orders yet</p>
                <button className="start-shopping-btn">Start Shopping</button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Products */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h3>Featured Products</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="products-grid">
            {products.slice(0, 6).map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5001${product.images[0]}`} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop'
                      }}
                    />
                  ) : (
                    <div className="placeholder-image">🥬</div>
                  )}
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="farmer">By {product.seller?.firstName} {product.seller?.lastName}</p>
                  <div className="product-rating">
                    ⭐ {product.averageRating || 4.5} ({product.totalReviews || 0})
                  </div>
                  <div className="product-price">Rs. {product.price}/{product.unit}</div>
                </div>
                <div className="product-actions">
                  <button className="favorite-btn">❤️</button>
                  <button className="add-cart-btn" onClick={() => onAddToCart(product._id)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Products Tab Component
const BuyerProductsTab = ({ products, categories, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid')

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category?._id === selectedCategory
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0)
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return (
    <div className="products-tab-container">
      <div className="products-tab-header">
        <div className="header-content">
          <h2 className="tab-title">Browse Fresh Products</h2>
          <p className="tab-subtitle">Discover fresh produce from local farmers</p>
        </div>
        
        <div className="products-filters-section">
          <div className="filters-row">
            <div className="search-filter">
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="category-filter">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name} ({products.filter(p => p.category?._id === category._id).length})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sort-filter">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
          
          <div className="results-info">
            <span className="results-count">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </div>
      </div>
      
      <div className="products-content">
        {filteredProducts.length > 0 ? (
          <div className={`products-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card-enhanced">
                <div className="product-badges">
                  {product.organic && <span className="badge organic">🌱 Organic</span>}
                  {product.isFeatured && <span className="badge featured">⭐ Featured</span>}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="badge low-stock">⚠️ Low Stock</span>
                  )}
                </div>
                
                <div className="product-image-container">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={`http://localhost:5001${product.images[0]}`} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop'
                      }}
                    />
                  ) : (
                    <div className="placeholder-image">🥬</div>
                  )}
                  <div className="product-overlay">
                    <button className="quick-view-btn">👁️ Quick View</button>
                  </div>
                </div>
                
                <div className="product-info-section">
                  <div className="product-header">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <span className="stars">⭐ {product.averageRating || 4.5}</span>
                      <span className="reviews">({product.totalReviews || 0})</span>
                    </div>
                  </div>
                  
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-meta">
                    <div className="seller-info">
                      <span className="seller-label">Seller:</span>
                      <span className="seller-name">
                        {product.seller?.firstName} {product.seller?.lastName}
                      </span>
                    </div>
                    {product.category && (
                      <span className="product-category-tag">
                        {product.category.icon} {product.category.name}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-pricing">
                    <div className="price-info">
                      <span className="current-price">Rs. {product.price}</span>
                      <span className="price-unit">/{product.unit}</span>
                    </div>
                    <div className="stock-info">
                      <span className={`stock-status ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} ${product.unit} available`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="product-actions-section">
                  <div className="quantity-selector">
                    <button className="qty-btn minus">-</button>
                    <input type="number" value="1" min="1" max={product.stock} className="qty-input" />
                    <button className="qty-btn plus">+</button>
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => onAddToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
                  </button>
                  <button className="favorite-btn" title="Add to Favorites">
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products-state">
            <div className="empty-state-content">
              <div className="empty-icon">🥬</div>
              <h3>No Products Found</h3>
              <p>
                {searchTerm 
                  ? `No products found for "${searchTerm}". Try different keywords.`
                  : selectedCategory !== 'all' 
                    ? 'No products available in this category.'
                    : 'No products available right now. Check back soon!'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                >
                  🔄 Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Cart Tab Component
const BuyerCartTab = ({ cart, onUpdateItem, onRemoveItem, onClearCart, onCreateOrder }) => {
  const [showCheckout, setShowCheckout] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-tab">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some fresh products to get started!</p>
          <button className="btn btn-primary">Browse Products</button>
        </div>
      </div>
    )
  }

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address')
      return
    }

    const orderData = {
      deliveryAddress: {
        street: deliveryAddress,
        city: 'Kathmandu',
        state: 'Bagmati',
        country: 'Nepal'
      },
      paymentMethod,
      deliveryInstructions: 'Please deliver during business hours'
    }

    onCreateOrder(orderData)
    setShowCheckout(false)
  }

  return (
    <div className="cart-tab">
      <div className="cart-header">
        <h3>Shopping Cart ({cart.totalItems} items)</h3>
        <button className="btn btn-outline" onClick={onClearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="item-image">
              <img 
                src={item.productImage ? `http://localhost:5001${item.productImage}` : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop'} 
                alt={item.productName}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop';
                }}
              />
            </div>
            <div className="item-details">
              <h4>{item.productName}</h4>
              <p>Rs. {item.price}/{item.unit}</p>
              <p>Seller: {item.sellerName}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => onUpdateItem(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => onUpdateItem(item.productId, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">
              Rs. {item.total}
            </div>
            <button className="remove-btn" onClick={() => onRemoveItem(item.productId)}>
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>Rs. {cart.totalValue}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee:</span>
          <span>Rs. 50</span>
        </div>
        <div className="summary-row">
          <span>Tax (13%):</span>
          <span>Rs. {Math.round(cart.totalValue * 0.13)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>Rs. {cart.totalValue + 50 + Math.round(cart.totalValue * 0.13)}</span>
        </div>
      </div>

      <div className="cart-actions">
        <button className="btn btn-primary" onClick={() => window.location.href = '/checkout'}>
          Proceed to Checkout
        </button>
      </div>

      {showCheckout && (
        <div className="checkout-modal">
          <div className="checkout-content">
            <h3>Checkout</h3>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cod">Cash on Delivery</option>
                <option value="khalti">Khalti</option>
                <option value="esewa">eSewa</option>
              </select>
            </div>
            <div className="checkout-actions">
              <button className="btn btn-outline" onClick={() => setShowCheckout(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCheckout}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Orders Tab Component
const BuyerOrdersTab = ({ orders, onConfirmReceipt }) => {
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirmReceiptDialog, setConfirmReceiptDialog] = useState({ isOpen: false, order: null })

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'status-pending', icon: '⏳', label: 'Pending' },
      approved: { color: 'status-approved', icon: '✅', label: 'Approved' },
      rejected: { color: 'status-rejected', icon: '❌', label: 'Rejected' },
      confirmed: { color: 'status-confirmed', icon: '✅', label: 'Confirmed' },
      processing: { color: 'status-processing', icon: '👨‍🍳', label: 'Processing' },
      shipped: { color: 'status-shipped', icon: '🚚', label: 'Shipped' },
      delivered: { color: 'status-delivered', icon: '📦', label: 'Delivered' },
      received: { color: 'status-received', icon: '🎉', label: 'Received' },
      cancelled: { color: 'status-cancelled', icon: '❌', label: 'Cancelled' }
    };
    return statusMap[status] || statusMap.pending;
  }

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`)
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  return (
    <div className="orders-tab-container">
      <div className="orders-tab-header">
        <div className="header-content">
          <h2 className="tab-title">Order History</h2>
          <p className="tab-subtitle">Track and manage all your orders</p>
        </div>
        <div className="header-actions">
          <div className="orders-summary">
            <span className="orders-count">{orders.length} total orders</span>
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="orders-content">
        {filteredOrders.length > 0 ? (
          <div className="orders-grid">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              return (
                <div key={order._id} className="order-card-enhanced">
                  <div className="order-card-header">
                    <div className="order-main-info">
                      <h3 className="order-number">#{order.orderNumber}</h3>
                      <p className="order-date">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className={`order-status-badge ${statusInfo.color}`}>
                      <span className="status-icon">{statusInfo.icon}</span>
                      <span className="status-text">{statusInfo.label}</span>
                    </div>
                  </div>
                  
                  <div className="order-items-section">
                    <div className="items-header">
                      <h4>Items ({order.items?.length || 0})</h4>
                    </div>
                    <div className="order-items-grid">
                      {order.items?.slice(0, 4).map((item, index) => (
                        <div key={index} className="order-item-card">
                          <div className="item-image">
                            <img 
                              src={item.productImage ? `http://localhost:5001${item.productImage}` : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=60&h=60&fit=crop'}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=60&h=60&fit=crop';
                              }} 
                              alt={item.productName}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=60&h=60&fit=crop';
                              }}
                            />
                          </div>
                          <div className="item-details">
                            <span className="item-name">{item.productName}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                            <span className="item-price">Rs. {item.total}</span>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="more-items-card">
                          <span>+{order.items.length - 4} more items</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-summary-section">
                    <div className="order-total-info">
                      <div className="total-breakdown">
                        <span className="subtotal">Subtotal: Rs. {order.subtotal}</span>
                        <span className="delivery">Delivery: Rs. {order.deliveryFee || 50}</span>
                        <span className="tax">Tax: Rs. {order.tax || 0}</span>
                      </div>
                      <div className="total-amount">
                        <span className="total-label">Total:</span>
                        <span className="total-value">Rs. {order.total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-actions-section">
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleViewDetails(order._id)}
                      >
                        📋 View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button 
                          className="btn btn-success"
                          onClick={() => setConfirmReceiptDialog({ isOpen: true, order })}
                        >
                          ✅ Confirm Receipt
                        </button>
                      )}
                      {order.status === 'received' && (
                        <button className="btn btn-primary">
                          ⭐ Write Review
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="btn btn-info">
                          📍 Track Order
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(order.status) && (
                        <button className="btn btn-danger">
                          ❌ Cancel Order
                        </button>
                      )}
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setSelectedOrder(order)}
                      >
                        📞 Contact Seller
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="no-orders-state">
            <div className="empty-state-content">
              <div className="empty-icon">📦</div>
              <h3>No orders found</h3>
              <p>
                {statusFilter === 'all' 
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!" 
                  : `No ${statusFilter} orders found. Try changing the filter.`}
              </p>
              <button 
                className="btn btn-primary btn-large"
                onClick={() => window.location.href = '#products'}
              >
                🛒 Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Seller - Order #{selectedOrder.orderNumber}</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="seller-contact-info">
                <h4>Seller Information</h4>
                <p>For any questions about this order, you can contact the seller directly:</p>
                <div className="contact-options">
                  <button className="contact-btn email-btn">
                    📧 Send Email
                  </button>
                  <button className="contact-btn phone-btn">
                    📞 Call Seller
                  </button>
                  <button className="contact-btn message-btn">
                    💬 Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Placeholder components for other tabs
const BuyerFavoritesTab = () => (
  <div className="favorites-tab">
    <h3>Favorite Items</h3>
    <p>No favorite items yet. Start adding products to your favorites!</p>
  </div>
)

const BuyerPaymentsTab = () => (
  <div className="payments-tab">
    <h3>Payment Methods</h3>
    <div className="payment-methods">
      <div className="payment-method">
        <h4>Cash on Delivery</h4>
        <p>Pay when you receive your order</p>
        <button className="btn btn-outline">Default</button>
      </div>
      <div className="payment-method">
        <h4>Khalti</h4>
        <p>Digital wallet payment</p>
        <button className="btn btn-primary">Connect</button>
      </div>
      <div className="payment-method">
        <h4>eSewa</h4>
        <p>Online payment gateway</p>
        <button className="btn btn-primary">Connect</button>
      </div>
    </div>
  </div>
)

const BuyerDeliveryTab = ({ user }) => (
  <div className="delivery-tab">
    <h3>Delivery Addresses</h3>
    <div className="delivery-addresses">
      <div className="address-item">
        <div className="address-header">
          <h4>Home Address</h4>
          <span className="default-badge">Default</span>
        </div>
        <p className="address-text">{user.address || 'Ward 5, Thamel, Kathmandu'}</p>
        <p className="address-city">{user.city || 'Kathmandu'}</p>
        <div className="address-actions">
          <button className="btn btn-outline">Edit</button>
        </div>
      </div>
    </div>
  </div>
)

const BuyerReviewsTab = ({ reviewableProducts, myReviews, onWriteReview }) => {
  const [activeReviewTab, setActiveReviewTab] = useState('write')

  return (
    <div className="reviews-tab">
      <div className="reviews-header">
        <h3>📝 Reviews & Feedback</h3>
        <div className="review-tabs">
          <button 
            className={`review-tab-btn ${activeReviewTab === 'write' ? 'active' : ''}`}
            onClick={() => setActiveReviewTab('write')}
          >
            ✍️ Write Reviews ({reviewableProducts.length})
          </button>
          <button 
            className={`review-tab-btn ${activeReviewTab === 'my-reviews' ? 'active' : ''}`}
            onClick={() => setActiveReviewTab('my-reviews')}
          >
            ⭐ My Reviews ({myReviews.length})
          </button>
        </div>
      </div>

      {activeReviewTab === 'write' && (
        <div className="reviewable-products">
          {reviewableProducts.length > 0 ? (
            <>
              <div className="section-header">
                <h4>Products Ready for Review</h4>
                <p>Share your experience with these delivered products</p>
              </div>
              <div className="reviewable-grid">
                {reviewableProducts.map((product) => (
                  <div key={`${product.orderId}-${product.productId}`} className="reviewable-card">
                    <div className="product-image">
                      <img 
                        src={product.productImage ? `http://localhost:5001${product.productImage}` : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop'} 
                        alt={product.productName}
                      />
                    </div>
                    <div className="product-info">
                      <h5>{product.productName}</h5>
                      <p className="order-info">Order #{product.orderNumber}</p>
                      <p className="order-date">
                        Delivered: {new Date(product.orderDate).toLocaleDateString()}
                      </p>
                      <p className="quantity">Qty: {product.quantity}</p>
                    </div>
                    <div className="review-action">
                      <button 
                        className="write-review-btn"
                        onClick={() => onWriteReview(product)}
                      >
                        ✍️ Write Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h4>No Products to Review</h4>
              <p>You'll see delivered products here that you can review.</p>
              <p>Start shopping to share your experiences!</p>
            </div>
          )}
        </div>
      )}

      {activeReviewTab === 'my-reviews' && (
        <div className="my-reviews">
          {myReviews.length > 0 ? (
            <>
              <div className="section-header">
                <h4>Your Reviews</h4>
                <p>Reviews you've written for products</p>
              </div>
              <div className="reviews-list">
                {myReviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="product-info">
                        <img 
                          src={review.product?.images?.[0] ? `http://localhost:5001${review.product.images[0]}` : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=60&h=60&fit=crop'} 
                          alt={review.product?.name}
                          className="product-thumb"
                        />
                        <div>
                          <h5>{review.product?.name}</h5>
                          <div className="rating-display">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>
                                ★
                              </span>
                            ))}
                            <span className="rating-text">({review.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="review-content">
                      <h6>{review.title}</h6>
                      <p>{review.comment}</p>
                      {review.isRecommended !== null && (
                        <div className="recommendation">
                          {review.isRecommended ? '👍 Recommended' : '👎 Not Recommended'}
                        </div>
                      )}
                    </div>
                    {review.sellerResponse && (
                      <div className="seller-response">
                        <h6>Seller Response:</h6>
                        <p>{review.sellerResponse.comment}</p>
                        <small>
                          Responded on {new Date(review.sellerResponse.respondedAt).toLocaleDateString()}
                        </small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <h4>No Reviews Yet</h4>
              <p>You haven't written any reviews yet.</p>
              <p>Check the "Write Reviews" tab to review your delivered products!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const BuyerProfileTab = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const token = authAPI.getAuthToken()
      const response = await authAPI.updateProfile(profileData)
      
      if (response.success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        // Update user data in parent component if needed
      } else {
        toast.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Update profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="profile-tab">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
        </div>
        <div className="profile-title">
          <h3>👤 My Profile</h3>
          <p>Manage your personal information</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h4>Personal Information</h4>
          <div className="profile-grid">
            <div className="profile-field">
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                />
              ) : (
                <div className="field-value">{user.firstName || 'Not provided'}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
              ) : (
                <div className="field-value">{user.lastName || 'Not provided'}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              ) : (
                <div className="field-value">{user.email}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="field-value">{user.phone || 'Not provided'}</div>
              )}
            </div>

            <div className="profile-field full-width">
              <label>Address</label>
              {isEditing ? (
                <textarea
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                  rows={3}
                />
              ) : (
                <div className="field-value">{user.address || 'Not provided'}</div>
              )}
            </div>

            <div className="profile-field">
              <label>City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              ) : (
                <div className="field-value">{user.city || 'Not provided'}</div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h4>Account Statistics</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <div className="stat-value">12</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-value">8</div>
                <div className="stat-label">Reviews Written</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-info">
                <div className="stat-value">25</div>
                <div className="stat-label">Favorite Products</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-value">Gold</div>
                <div className="stat-label">Member Status</div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h4>Account Security</h4>
          <div className="security-options">
            <div className="security-item">
              <div className="security-info">
                <h5>Password</h5>
                <p>Last changed 3 months ago</p>
              </div>
              <button className="btn btn-outline">Change Password</button>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h5>Two-Factor Authentication</h5>
                <p>Add an extra layer of security</p>
              </div>
              <button className="btn btn-outline">Enable 2FA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BuyerSettingsTab = ({ user }) => (
  <div className="settings-tab">
    <h3>Account Settings</h3>
    <div className="settings-options">
      <div className="setting-option">
        <h4>Personal Information</h4>
        <p>Update your name, email, and phone number</p>
        <button className="btn btn-outline">Edit</button>
      </div>
      <div className="setting-option">
        <h4>Delivery Preferences</h4>
        <p>Manage your delivery addresses and preferences</p>
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

export default EnhancedBuyerDashboard
