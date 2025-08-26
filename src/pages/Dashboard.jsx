import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('vegruit_user')
    if (!userData) {
      toast.error('Please login to access dashboard')
      navigate('/login')
      return
    }

    const userInfo = JSON.parse(userData)
    setUser(userInfo)
    
    // Load mock data
    loadMockData()
  }, [navigate])

  const loadMockData = () => {
    // Mock orders
    const mockOrders = [
      {
        id: 'ORD001',
        date: '2024-01-15',
        status: 'Delivered',
        items: [
          { name: 'Fresh Apples', quantity: 2, price: 180 },
          { name: 'Organic Cauliflower', quantity: 1, price: 80 }
        ],
        total: 440,
        deliveryAddress: 'Ward 5, Thamel, Kathmandu'
      },
      {
        id: 'ORD002',
        date: '2024-01-20',
        status: 'Processing',
        items: [
          { name: 'Juicy Oranges', quantity: 3, price: 120 },
          { name: 'Red Tomatoes', quantity: 2, price: 90 }
        ],
        total: 540,
        deliveryAddress: 'Ward 5, Thamel, Kathmandu'
      }
    ]

    // Mock favorites
    const mockFavorites = [
      { id: 1, name: 'Fresh Apples', image: '🍎', price: 'Rs. 180/kg' },
      { id: 2, name: 'Organic Cauliflower', image: '🥦', price: 'Rs. 80/kg' },
      { id: 3, name: 'Juicy Oranges', image: '🍊', price: 'Rs. 120/kg' }
    ]

    setOrders(mockOrders)
    setFavorites(mockFavorites)
  }

  const handleLogout = () => {
    localStorage.removeItem('vegruit_user')
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handlePayment = (orderId) => {
    toast.success(`Payment initiated for order ${orderId}`)
    // Here you would integrate with actual payment gateway
  }

  const handleFeedback = (orderId) => {
    toast.success(`Feedback submitted for order ${orderId}`)
  }

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          toast.success(`Location updated: ${latitude}, ${longitude}`)
          // Here you would save the location to user profile
        },
        (error) => {
          toast.error('Unable to get location')
        }
      )
    } else {
      toast.error('Geolocation not supported')
    }
  }

  if (!user) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <img src={user.avatar} alt={user.name || user.fullName} className="user-avatar" />
            <div className="user-info">
              <h3>{user.name || user.fullName}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
          <button
            className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            ❤️ Favorites
          </button>
          <button
            className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            💳 Payments
          </button>
          <button
            className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            💬 Feedback
          </button>
          <button
            className={`nav-item ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            📍 Location
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{getTabTitle(activeTab)}</h1>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <button className="help-btn">❓</button>
          </div>
        </header>

        <div className="dashboard-content">
          {renderTabContent()}
        </div>
      </main>
    </div>
  )

  function getTabTitle(tab) {
    const titles = {
      overview: 'Dashboard Overview',
      profile: 'Profile Settings',
      orders: 'Order History',
      favorites: 'Favorite Items',
      payments: 'Payment Methods',
      feedback: 'Feedback & Reviews',
      location: 'Location & Delivery',
      settings: 'Account Settings'
    }
    return titles[tab] || 'Dashboard'
  }

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} orders={orders} />
      case 'profile':
        return <ProfileTab user={user} isEditing={isEditing} setIsEditing={setIsEditing} />
      case 'orders':
        return <OrdersTab orders={orders} onPayment={handlePayment} onFeedback={handleFeedback} />
      case 'favorites':
        return <FavoritesTab favorites={favorites} />
      case 'payments':
        return <PaymentsTab />
      case 'feedback':
        return <FeedbackTab />
      case 'location':
        return <LocationTab onLocationUpdate={handleLocationUpdate} user={user} />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab user={user} orders={orders} />
    }
  }
}

// Tab Components
const OverviewTab = ({ user, orders }) => (
  <div className="overview-tab">
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-content">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <h3>Rs. {orders.reduce((sum, order) => sum + order.total, 0)}</h3>
          <p>Total Spent</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">⭐</div>
        <div className="stat-content">
          <h3>4.9</h3>
          <p>Average Rating</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📍</div>
        <div className="stat-content">
          <h3>{user.city || 'Kathmandu'}</h3>
          <p>Delivery City</p>
        </div>
      </div>
    </div>

    <div className="recent-orders">
      <h3>Recent Orders</h3>
      <div className="orders-list">
        {orders.slice(0, 3).map(order => (
          <div key={order.id} className="order-item">
            <div className="order-info">
              <h4>Order {order.id}</h4>
              <p>{order.date} • {order.status}</p>
              <p>Total: Rs. {order.total}</p>
            </div>
            <div className="order-status">
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ProfileTab = ({ user, isEditing, setIsEditing }) => (
  <div className="profile-tab">
    <div className="profile-header">
      <img src={user.avatar} alt={user.name || user.fullName} className="profile-avatar" />
      <div className="profile-info">
        <h2>{user.name || user.fullName}</h2>
        <p>{user.email}</p>
        <p>Member since {new Date(user.registrationTime || user.loginTime).toLocaleDateString()}</p>
      </div>
      <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit Profile'}
      </button>
    </div>

    <div className="profile-details">
      <div className="detail-group">
        <label>Full Name</label>
        <input type="text" defaultValue={user.name || user.fullName} disabled={!isEditing} />
      </div>
      <div className="detail-group">
        <label>Email</label>
        <input type="email" defaultValue={user.email} disabled={!isEditing} />
      </div>
      <div className="detail-group">
        <label>Phone</label>
        <input type="tel" defaultValue={user.phone || 'Not provided'} disabled={!isEditing} />
      </div>
      <div className="detail-group">
        <label>Address</label>
        <input type="text" defaultValue={user.address || 'Not provided'} disabled={!isEditing} />
      </div>
      <div className="detail-group">
        <label>City</label>
        <input type="text" defaultValue={user.city || 'Kathmandu'} disabled={!isEditing} />
      </div>
    </div>
  </div>
)

const OrdersTab = ({ orders, onPayment, onFeedback }) => (
  <div className="orders-tab">
    <h3>Order History</h3>
    <div className="orders-grid">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h4>Order {order.id}</h4>
            <span className={`status-badge ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.name}</span>
                <span>{item.quantity} x Rs. {item.price}</span>
              </div>
            ))}
          </div>
          <div className="order-footer">
            <div className="order-total">
              <strong>Total: Rs. {order.total}</strong>
            </div>
            <div className="order-actions">
              {order.status === 'Processing' && (
                <button className="btn btn-primary" onClick={() => onPayment(order.id)}>
                  💳 Pay Now
                </button>
              )}
              {order.status === 'Delivered' && (
                <button className="btn btn-secondary" onClick={() => onFeedback(order.id)}>
                  💬 Leave Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const FavoritesTab = ({ favorites }) => (
  <div className="favorites-tab">
    <h3>Favorite Items</h3>
    <div className="favorites-grid">
      {favorites.map(item => (
        <div key={item.id} className="favorite-card">
          <div className="favorite-icon">{item.image}</div>
          <div className="favorite-info">
            <h4>{item.name}</h4>
            <p>{item.price}</p>
          </div>
          <button className="remove-favorite">❌</button>
        </div>
      ))}
    </div>
  </div>
)

const PaymentsTab = () => (
  <div className="payments-tab">
    <h3>Payment Methods</h3>
    <div className="payment-methods">
      <div className="payment-method">
        <div className="method-icon">💳</div>
        <div className="method-info">
          <h4>Credit/Debit Card</h4>
          <p>Visa, Mastercard, American Express</p>
        </div>
        <button className="add-method">Add</button>
      </div>
      <div className="payment-method">
        <div className="method-icon">🏦</div>
        <div className="method-info">
          <h4>Bank Transfer</h4>
          <p>Direct bank transfer</p>
        </div>
        <button className="add-method">Add</button>
      </div>
      <div className="payment-method">
        <div className="method-icon">📱</div>
        <div className="method-info">
          <h4>Digital Wallets</h4>
          <p>eSewa, Khalti, IME Pay</p>
        </div>
        <button className="add-method">Add</button>
      </div>
    </div>
  </div>
)

const FeedbackTab = () => (
  <div className="feedback-tab">
    <h3>Feedback & Reviews</h3>
    <div className="feedback-form">
      <div className="form-group">
        <label>Rate your experience</label>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} className="star-btn">⭐</button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Your feedback</label>
        <textarea placeholder="Share your experience with VegRuit..." rows="4"></textarea>
      </div>
      <button className="btn btn-primary">Submit Feedback</button>
    </div>
  </div>
)

const LocationTab = ({ onLocationUpdate, user }) => (
  <div className="location-tab">
    <h3>Location & Delivery</h3>
    <div className="location-info">
      <div className="current-location">
        <h4>Current Delivery Address</h4>
        <p>{user.address || 'No address provided'}</p>
        <p>{user.city || 'Kathmandu'}, Nepal</p>
      </div>
      <button className="btn btn-primary" onClick={onLocationUpdate}>
        📍 Update Location
      </button>
    </div>
    
    <div className="delivery-zones">
      <h4>Delivery Zones</h4>
      <div className="zones-grid">
        <div className="zone-card">
          <h5>Same Day Delivery</h5>
          <p>Kathmandu Valley (Within 8 hours)</p>
          <span className="zone-badge">Premium</span>
        </div>
        <div className="zone-card">
          <h5>Next Day Delivery</h5>
          <p>Extended Valley Areas (24 hours)</p>
          <span className="zone-badge">Standard</span>
        </div>
      </div>
    </div>
  </div>
)

const SettingsTab = () => (
  <div className="settings-tab">
    <h3>Account Settings</h3>
    <div className="settings-section">
      <h4>Notifications</h4>
      <div className="setting-item">
        <label>Email Notifications</label>
        <input type="checkbox" defaultChecked />
      </div>
      <div className="setting-item">
        <label>SMS Notifications</label>
        <input type="checkbox" />
      </div>
      <div className="setting-item">
        <label>Push Notifications</label>
        <input type="checkbox" defaultChecked />
      </div>
    </div>
    
    <div className="settings-section">
      <h4>Privacy</h4>
      <div className="setting-item">
        <label>Profile Visibility</label>
        <select defaultValue="public">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
    </div>
    
    <div className="settings-section">
      <h4>Security</h4>
      <button className="btn btn-secondary">Change Password</button>
      <button className="btn btn-secondary">Two-Factor Authentication</button>
    </div>
  </div>
)

export default Dashboard
