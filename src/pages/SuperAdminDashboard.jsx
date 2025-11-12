import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaUsers, FaShoppingCart, FaBox, FaTags, FaChartLine, 
  FaUserShield, FaSignOutAlt, FaTrash, FaBan, FaCheck,
  FaStore, FaShoppingBag, FaDollarSign, FaExclamationTriangle,
  FaCog, FaKey, FaBell, FaDatabase, FaSync
} from 'react-icons/fa';
import { superadminAPI } from '../services/superadminAPI';
import logoFinal from '../assets/logofinal.png';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if superadmin is logged in
    const superadminLoggedIn = localStorage.getItem('superadminLoggedIn');
    if (!superadminLoggedIn) {
      toast.error('Unauthorized access!');
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all data with proper error handling
      const [statsData, usersData, buyersData, sellersData, productsData, categoriesData, ordersData] = await Promise.all([
        superadminAPI.getDashboardStats().catch((err) => {
          console.error('Stats error:', err);
          return { totalUsers: 0, totalBuyers: 0, totalSellers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 };
        }),
        superadminAPI.getAllUsers().catch((err) => {
          console.error('Users error:', err);
          return [];
        }),
        superadminAPI.getAllBuyers().catch((err) => {
          console.error('Buyers error:', err);
          return [];
        }),
        superadminAPI.getAllSellers().catch((err) => {
          console.error('Sellers error:', err);
          return [];
        }),
        superadminAPI.getAllProducts().catch((err) => {
          console.error('Products error:', err);
          return [];
        }),
        superadminAPI.getAllCategories().catch((err) => {
          console.error('Categories error:', err);
          return [];
        }),
        superadminAPI.getAllOrders().catch((err) => {
          console.error('Orders error:', err);
          return [];
        })
      ]);

      console.log('Loaded data:', { statsData, usersData, buyersData, sellersData, productsData, categoriesData, ordersData });

      setStats(statsData);
      setUsers(usersData);
      setBuyers(buyersData);
      setSellers(sellersData);
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
      
      toast.success('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('superadminLoggedIn');
      localStorage.removeItem('superadminData');
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      await superadminAPI.deactivateUser(userId);
      toast.success('User deactivated successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to deactivate user');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await superadminAPI.activateUser(userId);
      toast.success('User activated successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to activate user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone!')) return;
    
    try {
      await superadminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await superadminAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? All products in this category will be affected!')) return;
    
    try {
      await superadminAPI.deleteCategory(categoryId);
      toast.success('Category deleted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalUsers || users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card buyers">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalBuyers || buyers.length}</h3>
            <p>Total Buyers</p>
          </div>
        </div>

        <div className="stat-card sellers">
          <div className="stat-icon">
            <FaStore />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalSellers || sellers.length}</h3>
            <p>Total Sellers</p>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">
            <FaBox />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalProducts || products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card categories">
          <div className="stat-icon">
            <FaTags />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalCategories || categories.length}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <FaShoppingBag />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalOrders || orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h3>Rs. {stats?.totalRevenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card growth">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats?.growthRate || '0'}%</h3>
            <p>Growth Rate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => {
    const filteredUsers = users.filter(user => 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="users-section">
        <div className="section-header">
          <h2>All Users Management ({filteredUsers.length})</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="no-data">
            <p>No users found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user._id?.slice(-6)}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.isBuyer && user.isSeller ? 'both' : user.isBuyer ? 'buyer' : 'seller'}`}>
                        {user.isBuyer && user.isSeller ? 'Both' : user.isBuyer ? 'Buyer' : 'Seller'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {user.isActive ? (
                          <button
                            onClick={() => handleDeactivateUser(user._id)}
                            className="action-btn deactivate"
                            title="Deactivate"
                          >
                            <FaBan />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user._id)}
                            className="action-btn activate"
                            title="Activate"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderBuyers = () => {
    const filteredBuyers = buyers.filter(buyer => 
      buyer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="buyers-section">
        <div className="section-header">
          <h2>Buyers Management ({filteredBuyers.length})</h2>
          <input
            type="text"
            placeholder="Search buyers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredBuyers.length === 0 ? (
          <div className="no-data">
            <p>No buyers found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuyers.map(buyer => (
                  <tr key={buyer._id}>
                    <td>{buyer._id?.slice(-6)}</td>
                    <td>{buyer.firstName} {buyer.lastName}</td>
                    <td>{buyer.email}</td>
                    <td>{buyer.phone || 'N/A'}</td>
                    <td>{buyer.ordersCount || 0}</td>
                    <td>
                      <span className={`status-badge ${buyer.isActive ? 'active' : 'inactive'}`}>
                        {buyer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {buyer.isActive ? (
                          <button
                            onClick={() => handleDeactivateUser(buyer._id)}
                            className="action-btn deactivate"
                            title="Deactivate"
                          >
                            <FaBan />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(buyer._id)}
                            className="action-btn activate"
                            title="Activate"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(buyer._id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSellers = () => {
    const filteredSellers = sellers.filter(seller => 
      seller.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="sellers-section">
        <div className="section-header">
          <h2>Sellers Management ({filteredSellers.length})</h2>
          <input
            type="text"
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredSellers.length === 0 ? (
          <div className="no-data">
            <p>No sellers found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Farm Name</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map(seller => (
                  <tr key={seller._id}>
                    <td>{seller._id?.slice(-6)}</td>
                    <td>{seller.firstName} {seller.lastName}</td>
                    <td>{seller.email}</td>
                    <td>{seller.phone || 'N/A'}</td>
                    <td>{seller.farmName || 'N/A'}</td>
                    <td>{seller.productsCount || 0}</td>
                    <td>
                      <span className={`status-badge ${seller.isActive ? 'active' : 'inactive'}`}>
                        {seller.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {seller.isActive ? (
                          <button
                            onClick={() => handleDeactivateUser(seller._id)}
                            className="action-btn deactivate"
                            title="Deactivate"
                          >
                            <FaBan />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(seller._id)}
                            className="action-btn activate"
                            title="Activate"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(seller._id)}
                          className="action-btn delete"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderProducts = () => {
    const filteredProducts = products.filter(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="products-section">
        <div className="section-header">
          <h2>Products Management ({filteredProducts.length})</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-data">
            <p>No products found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Seller</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>{product._id?.slice(-6)}</td>
                    <td>
                      <img 
                        src={product.image ? `http://localhost:5001${product.image}` : '/api/placeholder/50/50'} 
                        alt={product.name}
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/50/50';
                        }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>Rs. {product.price}/{product.unit}</td>
                    <td>{product.stock} {product.unit}</td>
                    <td>{product.seller?.username || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="action-btn delete"
                          title="Delete Product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderCategories = () => {
    const filteredCategories = categories.filter(category => 
      category.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="categories-section">
        <div className="section-header">
          <h2>Categories Management ({filteredCategories.length})</h2>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="no-data">
            <p>No categories found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Products Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(category => (
                  <tr key={category._id}>
                    <td>{category._id?.slice(-6)}</td>
                    <td><strong>{category.name}</strong></td>
                    <td>{category.description || 'No description'}</td>
                    <td>{category.productsCount || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="action-btn delete"
                          title="Delete Category"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSettings = () => {
    const adminData = JSON.parse(localStorage.getItem('superadminData') || '{}');
    
    return (
      <div className="settings-section">
        <div className="settings-grid">
          {/* Account Information Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <FaUserShield className="settings-icon" />
              <h3>Account Information</h3>
            </div>
            <div className="settings-card-body">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{adminData.username || 'admin_aadarsha'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value">Super Administrator</span>
              </div>
              <div className="info-row">
                <span className="info-label">Login Time:</span>
                <span className="info-value">
                  {adminData.loginTime ? new Date(adminData.loginTime).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="status-online">● Online</span>
              </div>
            </div>
          </div>

          {/* System Statistics Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <FaDatabase className="settings-icon" />
              <h3>System Statistics</h3>
            </div>
            <div className="settings-card-body">
              <div className="info-row">
                <span className="info-label">Total Users:</span>
                <span className="info-value">{users.length}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Total Products:</span>
                <span className="info-value">{products.length}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Total Categories:</span>
                <span className="info-value">{categories.length}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Total Orders:</span>
                <span className="info-value">{orders.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="settings-card">
            <div className="settings-card-header">
              <FaSync className="settings-icon" />
              <h3>Quick Actions</h3>
            </div>
            <div className="settings-card-body">
              <button 
                className="settings-action-btn refresh-btn"
                onClick={loadDashboardData}
              >
                <FaSync />
                <span>Refresh Data</span>
              </button>
              <button 
                className="settings-action-btn notification-btn"
                onClick={() => toast.info('Notifications feature coming soon!')}
              >
                <FaBell />
                <span>Notifications</span>
              </button>
              <button 
                className="settings-action-btn security-btn"
                onClick={() => toast.info('Security settings coming soon!')}
              >
                <FaKey />
                <span>Security</span>
              </button>
            </div>
          </div>

          {/* Logout Card */}
          <div className="settings-card logout-card">
            <div className="settings-card-header">
              <FaSignOutAlt className="settings-icon" />
              <h3>Session Management</h3>
            </div>
            <div className="settings-card-body">
              <p className="logout-description">
                End your current admin session and return to the homepage. 
                You will need to login again to access the dashboard.
              </p>
              <button 
                className="settings-logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout from Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="superadmin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="superadmin-dashboard">
      <aside className="superadmin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <img src={logoFinal} alt="TarkariShop Logo" />
          </div>
          <h2>Super Admin</h2>
          <p>Control Panel</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine />
            <span>Overview</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers />
            <span>All Users</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'buyers' ? 'active' : ''}`}
            onClick={() => setActiveTab('buyers')}
          >
            <FaShoppingCart />
            <span>Buyers</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'sellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('sellers')}
          >
            <FaStore />
            <span>Sellers</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaBox />
            <span>Products</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FaTags />
            <span>Categories</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <p className="admin-name">Admin Aadarsha</p>
            <p className="admin-status">● Online</p>
          </div>
        </div>
      </aside>

      <main className="superadmin-content">
        <header className="content-header">
          <div className="header-top-bar">
            <div className="header-logo-section">
              <img src={logoFinal} alt="TarkariShop" className="header-logo-img" />
              <div className="header-brand">
                <h2>TarkariShop</h2>
                <span>Super Admin Dashboard</span>
              </div>
            </div>
            <div className="header-admin-info">
              <span className="admin-welcome">Welcome, Admin Aadarsha</span>
              <span className="admin-role">Super Administrator</span>
            </div>
          </div>
          <div className="header-content">
            <h1 className="dashboard-title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'Users Management'}
              {activeTab === 'buyers' && 'Buyers Management'}
              {activeTab === 'sellers' && 'Sellers Management'}
              {activeTab === 'products' && 'Products Management'}
              {activeTab === 'categories' && 'Categories Management'}
              {activeTab === 'settings' && 'Settings & Configuration'}
            </h1>
            <p className="dashboard-subtitle">
              {activeTab === 'overview' && 'Monitor your platform statistics and performance'}
              {activeTab === 'users' && 'Manage all registered users on the platform'}
              {activeTab === 'buyers' && 'Manage buyer accounts and their activities'}
              {activeTab === 'sellers' && 'Manage seller accounts and their products'}
              {activeTab === 'products' && 'Manage all products listed on the platform'}
              {activeTab === 'categories' && 'Manage product categories and organization'}
              {activeTab === 'settings' && 'Configure dashboard settings and manage your account'}
            </p>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'buyers' && renderBuyers()}
          {activeTab === 'sellers' && renderSellers()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
