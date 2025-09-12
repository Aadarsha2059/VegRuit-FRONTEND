import React from 'react';
import '../../styles/Dashboard.css';

const DashboardLayout = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  children, 
  sidebarItems,
  headerTitle 
}) => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar-placeholder">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
              <span className={`user-type-badge ${user.userType}`}>
                {user.userType === 'buyer' ? '👤 Buyer' : '🌾 Seller'}
              </span>
              {user.userType === 'seller' && user.farmName && (
                <small>{user.farmName}</small>
              )}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{headerTitle}</h1>
          <div className="header-actions">
            <button className="notification-btn" title="Notifications">
              🔔
            </button>
            <button className="help-btn" title="Help">
              ❓
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;