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
import { STORAGE_KEYS } from '../services/authAPI'
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

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'products', label: 'Browse Products', icon: '🛒' },
    { key: 'cart', label: 'Shopping Cart', icon: '🛍️' },
    { key: 'orders', label: 'My Orders', icon: '📦' },
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
      orders: 'Order History',
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
        return <BuyerOrdersTab orders={orders} />
      case 'favorites':
        return <BuyerFavoritesTab />
      case 'payments':
        return <BuyerPaymentsTab />
      case 'delivery':
        return <BuyerDeliveryTab user={user} />
      case 'reviews':
        return <BuyerReviewsTab />
      case 'profile':
        return <BuyerProfileTab user={user} />
      case 'settings':
        return <BuyerSettingsTab user={user} />
      default:
        return <BuyerOverviewTab user={user} data={dashboardData} products={products} />
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
                  <div className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
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
                  <button className="add-cart-btn" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
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

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category?._id === selectedCategory
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  return (
    <div className="products-tab">
      <div className="tab-header">
        <h3>Available Products</h3>
        <div className="product-filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-item">
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
                <p className="product-price">Rs. {product.price}/{product.unit}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-stock">Stock: {product.stock} {product.unit}</p>
                {product.category && (
                  <span className="product-category">{product.category.name}</span>
                )}
                <div className="product-rating">
                  ⭐ {product.averageRating || 4.5} ({product.totalReviews || 0} reviews)
                </div>
              </div>
              <div className="product-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => onAddToCart(product._id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button className="btn btn-outline">
                  ❤️ Favorite
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <div className="no-products-icon">🥬</div>
            <h3>No Products Available</h3>
            <p>Check back soon for fresh produce from our farmers!</p>
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
              <img src={item.productImage || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop'} alt={item.productName} />
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
        <button className="btn btn-primary" onClick={() => setShowCheckout(true)}>
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
const BuyerOrdersTab = ({ orders }) => {
  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h3>Order History</h3>
      </div>
      
      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <h4>Order #{order.orderNumber}</h4>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-items">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <span>{item.productName}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Rs. {item.price}</span>
                    <small>Seller: {item.sellerName}</small>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: Rs. {order.total}</span>
                <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                <div className="order-actions">
                  <button className="btn btn-outline">View Details</button>
                  {order.status === 'delivered' && (
                    <button className="btn btn-primary">Review</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No orders found</p>
            <button className="btn btn-primary">Start Shopping</button>
          </div>
        )}
      </div>
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

const BuyerReviewsTab = () => (
  <div className="reviews-tab">
    <h3>My Reviews</h3>
    <p>No reviews yet. Start shopping to leave reviews!</p>
  </div>
)

const BuyerProfileTab = ({ user }) => (
  <div className="profile-tab">
    <h3>My Profile</h3>
    <div className="profile-info">
      <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>City:</strong> {user.city}</p>
    </div>
  </div>
)

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
