import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Calendar from '../Calendar'
import './DashboardLayout.css'

const DashboardLayout = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  sidebarItems, 
  headerTitle,
  onHelpClick,
  onCalendarClick,
  children 
}) => {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    onLogout()
    navigate('/')
    toast.success('Logged out successfully!')
  }

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">🌱</div>
            {!sidebarCollapsed && (
              <div className="brand-text">
                <h3>VegRuit</h3>
                <span>Dashboard</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {user && user.avatar ? (
              <img src={user.avatar} alt={user?.firstName || 'User'} />
            ) : (
              <div className="avatar-placeholder">
                {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <h4>{user?.firstName || 'User'} {user?.lastName || ''}</h4>
              <p>{user?.email || 'No email'}</p>
              <div className="user-roles">
                {user?.isBuyer && <span className="role-badge buyer">Buyer</span>}
                {user?.isSeller && <span className="role-badge seller">Seller</span>}
              </div>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => handleTabClick(item.key)}
              title={sidebarCollapsed ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="help-btn" onClick={onHelpClick} title="Help">
            <span className="nav-icon">❓</span>
            {!sidebarCollapsed && <span className="nav-label">Help</span>}
          </button>
          <button className="calendar-btn" onClick={onCalendarClick} title="Calendar">
            <span className="nav-icon">📅</span>
            {!sidebarCollapsed && <span className="nav-label">Calendar</span>}
          </button>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>{headerTitle}</h1>
            <div className="breadcrumb">
              <span>Dashboard</span>
              <span>›</span>
              <span>{sidebarItems.find(item => item.key === activeTab)?.label}</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-actions">
              <button className="action-btn notification-btn" title="Notifications">
                <span className="icon">🔔</span>
                <span className="badge">3</span>
              </button>
              <button className="action-btn help-btn" onClick={onHelpClick} title="Help">
                <span className="icon">❓</span>
              </button>
              <Calendar compact={true} />
            </div>
            
            <div className="user-menu">
              <div className="user-avatar-small">
                {user && user.avatar ? (
                  <img src={user.avatar} alt={user?.firstName || 'User'} />
                ) : (
                  <div className="avatar-placeholder-small">
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.firstName || 'User'} {user?.lastName || ''}</span>
                <span className="user-email">{user?.email || 'user@example.com'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout