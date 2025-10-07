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
import '../styles/Dashboard.css'
import '../styles/BuyerDashboard.css'

const BuyerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const { data: dashboardData, loading: dashboardLoading } = useBuyerDashboard()
  const { orders, loading: ordersLoading } = useBuyerOrders()

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts()
    }
  }, [activeTab])

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      const response = await getProducts({ isActive: true })
      if (response.success) {
        setProducts(response.data.products || [])
      } else {
        setProducts(response.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
    toast.success('Logged out successfully!')
  }

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '' },
    { key: 'products', label: 'Browse Products', icon: '' },
    { key: 'cart', label: 'Shopping Cart', icon: '' },
    { key: 'orders', label: 'My Orders', icon: '' },
    { key: 'favorites', label: 'Favorites', icon: '' },
    { key: 'payments', label: 'Payments', icon: '' },
    { key: 'delivery', label: 'Delivery', icon: '' },
    { key: 'reviews', label: 'Reviews', icon: '' },
    { key: 'profile', label: 'Profile', icon: '' },
    { key: 'settings', label: 'Settings', icon: '' }
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
    if (dashboardLoading) {
      return <LoadingSpinner message="Loading dashboard data..." />
    }

    switch (activeTab) {
      case 'overview':
        return <BuyerOverviewTab user={user} data={dashboardData} />
      case 'products':
        return <BuyerProductsTab products={products} loading={productsLoading} />
      case 'cart':
        return <BuyerCartTab />
      case 'orders':
        return <BuyerOrdersTab orders={orders} loading={ordersLoading} />
      case 'favorites':
        return <BuyerFavoritesTab favorites={dashboardData?.favoriteItems || []} />
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
        return <BuyerOverviewTab user={user} data={dashboardData} />
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

// Enhanced Overview Tab with Professional Design
const BuyerOverviewTab = ({ user, data }) => {
  if (!data) return <LoadingSpinner message="Loading overview..." />

  const { overview, recentOrders = [], favoriteItems = [], recentProducts = [] } = data

  return (
    <div className="buyer-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome back, {user.firstName}! </h2>
          <p>Ready to discover fresh, organic produce from local farmers?</p>
        </div>
        <div className="quick-actions">
          <button className="quick-action-btn primary">
            <span className="icon"> </span>
            Browse Products
          </button>
          <button className="quick-action-btn secondary">
            <span className="icon"> </span>
            Track Orders
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card orders">
          <div className="stat-icon"> </div>
          <div className="stat-content">
            <h3>{overview?.totalOrders || 0}</h3>
            <p>Total Orders</p>
            <span className="stat-trend">+2 this month</span>
          </div>
        </div>
        <div className="stat-card favorites">
          <div className="stat-icon"> </div>
          <div className="stat-content">
            <h3>{overview?.favoriteItems || 0}</h3>
            <p>Favorite Items</p>
            <span className="stat-trend">5 new items</span>
          </div>
        </div>
        <div className="stat-card spending">
          <div className="stat-icon"> </div>
          <div className="stat-content">
            <h3>Rs. {overview?.totalSpent || 0}</h3>
            <p>Total Spent</p>
            <span className="stat-trend">This month</span>
          </div>
        </div>
        <div className="stat-card savings">
          <div className="stat-icon"> </div>
          <div className="stat-content">
            <h3>Rs. 450</h3>
            <p>Money Saved</p>
            <span className="stat-trend">vs market price</span>
          </div>
        </div>
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
                <div key={order.id} className="order-preview-card">
                  <div className="order-info">
                    <h4>Order #{order.id}</h4>
                    <p>{order.items?.length || 0} items • Rs. {order.total}</p>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-date">
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon"> </div>
                <p>No orders yet</p>
                <button className="start-shopping-btn">Start Shopping</button>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Products */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Your Favorites</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="favorites-preview">
            {favoriteItems.length > 0 ? (
              favoriteItems.slice(0, 4).map((item) => (
                <div key={item.id} className="favorite-card">
                  <div className="product-image"> </div>
                  <h4>{item.name}</h4>
                  <p className="price">{item.price}</p>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon"> </div>
                <p>No favorites yet</p>
                <button className="browse-btn">Browse Products</button>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h3>Recommended for You</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="products-grid">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="product-card">
                <div className="product-image"> </div>
                <div className="product-info">
                  <h4>Fresh Lettuce</h4>
                  <p className="farmer">By Ram Farmer</p>
                  <div className="product-rating">
                    
                  </div>
                  <div className="product-price">Rs. 80/kg</div>
                </div>
                <div className="product-actions">
                  <button className="favorite-btn"> </button>
                  <button className="add-cart-btn">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const BuyerOrdersTab = ({ orders, loading }) => {
  const [statusFilter, setStatusFilter] = useState('all')

  if (loading) return <LoadingSpinner message="Loading orders..." />

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase())

  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h3>Order History</h3>
        <div className="order-filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
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
              <div className="order-items">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Rs. {item.price}</span>
                    <small>Farmer: {item.farmer}</small>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: Rs. {order.total}</span>
                <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                <div className="order-actions">
                  <button className="btn btn-outline">View Details</button>
                  {order.status === 'Delivered' && (
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

const BuyerFavoritesTab = ({ favorites }) => {
  const handleAddToCart = (item) => {
    toast.success(`${item.name} added to cart!`)
  }

  const handleRemoveFromFavorites = (item) => {
    toast.success(`${item.name} removed from favorites!`)
  }

  return (
    <div className="favorites-tab">
      <div className="tab-header">
        <h3>Favorite Items</h3>
        <p>{favorites.length} items in your favorites</p>
      </div>
      
      <div className="favorites-grid">
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <div className="favorite-icon">{item.image}</div>
              <h4>{item.name}</h4>
              <p className="item-price">{item.price}</p>
              <small>Farmer: {item.farmer}</small>
              {item.rating && (
                <div className="item-rating">
                  
                </div>
              )}
              <div className="item-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn btn-outline remove-btn"
                  onClick={() => handleRemoveFromFavorites(item)}
                >
                  
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No favorite items yet</p>
            <button className="btn btn-primary">Browse Products</button>
          </div>
        )}
      </div>
    </div>
  )
}

const BuyerProductsTab = ({ products, loading }) => {
  const [categoryFilter, setCategoryFilter] = useState('all')

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`)
  }

  const handleAddToFavorites = (product) => {
    toast.success(`${product.name} added to favorites!`)
  }

  if (loading) {
    return <LoadingSpinner message="Loading products..." />
  }

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category?.name?.toLowerCase() === categoryFilter.toLowerCase())

  return (
    <div className="products-tab">
      <div className="tab-header">
        <h3>Available Products</h3>
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
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-item">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`http://localhost:5000${product.images[0]}`} 
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
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleAddToFavorites(product)}
                >
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

const BuyerPaymentsTab = () => (
  <div className="payments-tab">
    <h3>Payment Methods</h3>
    <div className="payment-methods">
      <div className="payment-method">
        <h4>Khalti</h4>
        <p>Digital wallet payment</p>
        <button className="btn btn-primary">Connect Khalti</button>
      </div>
      <div className="payment-method">
        <h4>eSewa</h4>
        <p>Online payment gateway</p>
        <button className="btn btn-primary">Connect eSewa</button>
      </div>
      <div className="payment-method">
        <h4>Cash on Delivery</h4>
        <p>Pay when you receive your order</p>
        <button className="btn btn-outline">Default</button>
      </div>
    </div>
  </div>
)

const BuyerDeliveryTab = ({ user }) => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: user.address || 'Ward 5, Thamel, Kathmandu',
      city: user.city || 'Kathmandu',
      isDefault: true
    }
  ])

  const handleEditAddress = (addressId) => {
    toast.info('Address editing feature coming soon!')
  }

  const handleAddAddress = () => {
    toast.info('Add new address feature coming soon!')
  }

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })))
    toast.success('Default address updated!')
  }

  return (
    <div className="delivery-tab">
      <div className="tab-header">
        <h3>Delivery Addresses</h3>
        <button className="btn btn-primary" onClick={handleAddAddress}>
          + Add New Address
        </button>
      </div>
      
      <div className="delivery-addresses">
        {addresses.map((address) => (
          <div key={address.id} className="address-item">
            <div className="address-header">
              <h4>{address.type} Address</h4>
              {address.isDefault && (
                <span className="default-badge">Default</span>
              )}
            </div>
            <p className="address-text">{address.address}</p>
            <p className="address-city">{address.city}</p>
            <div className="address-actions">
              <button 
                className="btn btn-outline"
                onClick={() => handleEditAddress(address.id)}
              >
                Edit
              </button>
              {!address.isDefault && (
                <button 
                  className="btn btn-outline"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const BuyerReviewsTab = () => (
  <div className="reviews-tab">
    <h3>My Reviews</h3>
    <div className="reviews-content">
      <div className="review-form">
        <h4>Write a Review</h4>
        <textarea placeholder="Share your experience with the products and farmers..." />
        <button className="btn btn-primary">Submit Review</button>
      </div>
      <div className="reviews-list">
        <p>No reviews yet. Start shopping to leave reviews!</p>
      </div>
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
      <div className="setting-option">
        <h4>Privacy</h4>
        <p>Control your privacy settings</p>
        <button className="btn btn-outline">Configure</button>
      </div>
    </div>
  </div>
)

export default BuyerDashboard