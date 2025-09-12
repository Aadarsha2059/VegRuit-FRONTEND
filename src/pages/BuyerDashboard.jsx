import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import LoadingSpinner from '../components/dashboard/LoadingSpinner'
import { useBuyerDashboard, useBuyerOrders } from '../hooks/useDashboard'
import '../styles/Dashboard.css'

const BuyerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const { data: dashboardData, loading: dashboardLoading } = useBuyerDashboard()
  const { orders, loading: ordersLoading } = useBuyerOrders()

  const handleLogout = () => {
    onLogout()
    navigate('/')
    toast.success('Logged out successfully!')
  }

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'orders', label: 'My Orders', icon: '📦' },
    { key: 'favorites', label: 'Favorites', icon: '❤️' },
    { key: 'products', label: 'Products', icon: '🍎' },
    { key: 'payments', label: 'Payments', icon: '💳' },
    { key: 'delivery', label: 'Delivery', icon: '📍' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      overview: 'Buyer Dashboard Overview',
      orders: 'My Orders',
      favorites: 'Favorite Items',
      products: 'Available Products',
      payments: 'Payment Methods',
      delivery: 'Delivery Addresses',
      reviews: 'My Reviews',
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
      case 'orders':
        return <BuyerOrdersTab orders={orders} loading={ordersLoading} />
      case 'favorites':
        return <BuyerFavoritesTab favorites={dashboardData?.favoriteItems || []} />
      case 'products':
        return <BuyerProductsTab products={dashboardData?.recentProducts || []} />
      case 'payments':
        return <BuyerPaymentsTab />
      case 'delivery':
        return <BuyerDeliveryTab user={user} />
      case 'reviews':
        return <BuyerReviewsTab />
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

// Buyer-specific tab components
const BuyerOverviewTab = ({ user, data }) => {
  if (!data) return <LoadingSpinner message="Loading overview..." />

  const { overview, recentOrders = [], favoriteItems = [], recentProducts = [] } = data

  return (
    <div className="overview-tab">
      <div className="overview-stats">
        <StatCard
          title="Total Orders"
          value={overview?.totalOrders || 0}
          label="This month"
          icon="📦"
        />
        <StatCard
          title="Favorite Items"
          value={overview?.favoriteItems || 0}
          label="Saved items"
          icon="❤️"
        />
        <StatCard
          title="Total Spent"
          value={`Rs. ${overview?.totalSpent || 0}`}
          label="This month"
          icon="💰"
        />
        <StatCard
          title="Delivery Address"
          value={user.address || 'Not set'}
          label={user.city}
          icon="📍"
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
                    {order.items?.length || 0} items • Rs. {order.total}
                  </p>
                  <small>{new Date(order.date).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p className="no-data">No recent orders</p>
            )}
          </div>
        </div>

        <div className="favorite-items">
          <h3>Favorite Items</h3>
          <div className="favorites-preview">
            {favoriteItems.length > 0 ? (
              favoriteItems.map((item) => (
                <div key={item.id} className="favorite-preview-item">
                  <span className="favorite-icon">{item.image}</span>
                  <div className="favorite-info">
                    <h4>{item.name}</h4>
                    <p>{item.price}</p>
                    <small>{item.farmer}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No favorite items</p>
            )}
          </div>
        </div>

        <div className="recent-products">
          <h3>Available Products</h3>
          <div className="products-preview">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="product-preview-item">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-price">{product.price}</p>
                    <small>Farmer: {product.farmer}</small>
                  </div>
                  <div className="product-rating">
                    {'⭐'.repeat(Math.floor(product.rating || 0))} ({product.rating || 0})
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No products available</p>
            )}
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
                  {'⭐'.repeat(Math.floor(item.rating))} ({item.rating})
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
                  ❤️
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

const BuyerProductsTab = ({ products }) => {
  const [categoryFilter, setCategoryFilter] = useState('all')

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`)
  }

  const handleAddToFavorites = (product) => {
    toast.success(`${product.name} added to favorites!`)
  }

  const filteredProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(product => product.category?.toLowerCase() === categoryFilter.toLowerCase())

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
            <div key={product.id} className="product-item">
              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="product-price">{product.price}</p>
                <p className="product-farmer">Farmer: {product.farmer}</p>
                {product.category && (
                  <span className="product-category">{product.category}</span>
                )}
                <div className="product-rating">
                  {'⭐'.repeat(Math.floor(product.rating || 0))}
                  <span>({product.rating || 0})</span>
                </div>
              </div>
              <div className="product-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleAddToFavorites(product)}
                >
                  ❤️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No products found</p>
            <button className="btn btn-primary">Browse All Products</button>
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