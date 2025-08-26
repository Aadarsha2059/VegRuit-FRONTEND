import React from 'react'
import './DashboardTabs.css'

const OverviewTab = ({ user, orders, favorites }) => {
  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const favoriteCount = favorites.length

  return (
    <div className="overview-tab">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome back, {user.name || user.fullName}! 👋</h2>
          <p>Here's what's happening with your VegRuit account today</p>
        </div>
        <div className="welcome-illustration">
          <div className="illustration-icon">🥬</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Rs. {totalSpent}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{favoriteCount}</h3>
            <p>Favorite Items</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>4.9</h3>
            <p>Your Rating</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-content">
                <h4>Order {order.id}</h4>
                <p>{order.items.length} items • Rs. {order.total}</p>
                <span className="activity-status">{order.status}</span>
              </div>
              <div className="activity-date">
                {new Date(order.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">🛒</span>
            <span>Place New Order</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📍</span>
            <span>Update Location</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">💬</span>
            <span>Leave Feedback</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            <span>Account Settings</span>
          </button>
        </div>
      </div>

      {/* Seasonal Recommendations */}
      <div className="seasonal-recommendations">
        <h3>Seasonal Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <div className="recommendation-icon">🍎</div>
            <h4>Fresh Apples</h4>
            <p>Sweet and crisp apples from local orchards</p>
            <span className="price">Rs. 180/kg</span>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">🥦</div>
            <h4>Organic Cauliflower</h4>
            <p>Fresh organic cauliflower from nearby farms</p>
            <span className="price">Rs. 80/kg</span>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">🍊</div>
            <h4>Juicy Oranges</h4>
            <p>Sweet and tangy oranges rich in vitamin C</p>
            <span className="price">Rs. 120/kg</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
