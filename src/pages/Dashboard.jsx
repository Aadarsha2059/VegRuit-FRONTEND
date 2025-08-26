import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import OverviewTab from '../components/dashboard/OverviewTab'
import ProfileTab from '../components/dashboard/ProfileTab'
import '../styles/Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Load mock data
    loadMockData()
  }, [])

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
    onLogout()
    navigate('/')
  }

  const handleUpdateProfile = (updatedUser) => {
    // Update user data in localStorage
    localStorage.setItem('vegruit_user', JSON.stringify(updatedUser))
    toast.success('Profile updated successfully!')
  }

  const getTabTitle = (tab) => {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} orders={orders} favorites={favorites} />
      case 'profile':
        return <ProfileTab user={user} onUpdateProfile={handleUpdateProfile} />
      case 'orders':
        return <OrdersTab orders={orders} />
      case 'favorites':
        return <FavoritesTab favorites={favorites} />
      case 'payments':
        return <PaymentsTab />
      case 'feedback':
        return <FeedbackTab />
      case 'location':
        return <LocationTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab user={user} orders={orders} favorites={favorites} />
    }
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
}

// Placeholder tab components (to be moved to separate files)
const OrdersTab = ({ orders }) => (
  <div className="orders-tab">
    <h3>Order History</h3>
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <div className="order-header">
            <h4>Order {order.id}</h4>
            <span className={`order-status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-detail">
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>Rs. {item.price}</span>
              </div>
            ))}
          </div>
          <div className="order-footer">
            <span>Total: Rs. {order.total}</span>
            <span>Date: {new Date(order.date).toLocaleDateString()}</span>
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
      {favorites.map((item) => (
        <div key={item.id} className="favorite-item">
          <div className="favorite-icon">{item.image}</div>
          <h4>{item.name}</h4>
          <p>{item.price}</p>
          <button className="btn btn-primary">Add to Cart</button>
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
        <h4>Khalti</h4>
        <p>Digital wallet payment</p>
        <button className="btn btn-primary">Connect Khalti</button>
      </div>
      <div className="payment-method">
        <h4>eSewa</h4>
        <p>Online payment gateway</p>
        <button className="btn btn-primary">Connect eSewa</button>
      </div>
    </div>
  </div>
)

const FeedbackTab = () => (
  <div className="feedback-tab">
    <h3>Feedback & Reviews</h3>
    <div className="feedback-form">
      <textarea placeholder="Share your experience with VegRuit..." />
      <button className="btn btn-primary">Submit Feedback</button>
    </div>
  </div>
)

const LocationTab = () => (
  <div className="location-tab">
    <h3>Location & Delivery</h3>
    <div className="location-content">
      <div className="map-placeholder">
        <h4>Map of Kathmandu</h4>
        <p>Map integration will be added here</p>
        <button className="btn btn-primary">Update Location</button>
      </div>
    </div>
  </div>
)

const SettingsTab = () => (
  <div className="settings-tab">
    <h3>Account Settings</h3>
    <div className="settings-options">
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

export default Dashboard
