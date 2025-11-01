import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartAPI } from '../services/cartAPI';
import { orderAPI } from '../services/orderAPI';
import { authAPI } from '../services/authAPI';

const BuyerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    cart: false,
    orders: false,
    favorites: false
  });

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      if (activeTab === 'cart') {
        setLoading(prev => ({ ...prev, cart: true }));
        try {
          const token = authAPI.getAuthToken();
          const response = await cartAPI.getCart(token);
          if (response.success) {
            setCartItems(response.data.items || []);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          toast.error('Failed to load cart');
        } finally {
          setLoading(prev => ({ ...prev, cart: false }));
        }
      }
    };
    
    fetchCart();
  }, [activeTab]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        setLoading(prev => ({ ...prev, orders: true }));
        try {
          const token = authAPI.getAuthToken();
          const response = await orderAPI.getBuyerOrders(token);
          if (response.success) {
            setOrders(response.data.orders || []);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to load orders');
        } finally {
          setLoading(prev => ({ ...prev, orders: false }));
        }
      }
    };
    
    fetchOrders();
  }, [activeTab]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    toast.success('Logged out successfully!');
  };

  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'products', label: 'Browse Products', icon: '🥬' },
    { key: 'cart', label: 'Shopping Cart', icon: '🛒' },
    { key: 'orders', label: 'My Orders', icon: '📦' },
    { key: 'favorites', label: 'Favorites', icon: '❤️' },
    { key: 'payments', label: 'Payments', icon: '💳' },
    { key: 'delivery', label: 'Delivery', icon: '🚚' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ];

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
    };
    return titles[tab] || 'Buyer Dashboard';
  };

  // Add to cart function
  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const token = authAPI.getAuthToken();
      const response = await cartAPI.addToCart(token, productId, quantity);
      if (response.success) {
        toast.success('Item added to cart!');
      } else {
        toast.error(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Proceed to checkout with Cash on Delivery
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} orders={orders} favorites={favorites} />;
      case 'products':
        return <ProductsTab products={products} onAddToCart={handleAddToCart} />;
      case 'cart':
        return (
          <CartTab 
            cartItems={cartItems} 
            loading={loading.cart} 
            onProceedToCheckout={handleProceedToCheckout} 
          />
        );
      case 'orders':
        return <OrdersTab orders={orders} loading={loading.orders} />;
      case 'favorites':
        return <FavoritesTab favorites={favorites} />;
      case 'payments':
        return <PaymentsTab />;
      case 'delivery':
        return <DeliveryTab user={user} />;
      case 'reviews':
        return <ReviewsTab />;
      case 'profile':
        return <ProfileTab user={user} />;
      case 'settings':
        return <SettingsTab user={user} />;
      default:
        return <OverviewTab user={user} orders={orders} favorites={favorites} />;
    }
  };

  return (
    <div className="buyer-dashboard">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2>Buyer Dashboard</h2>
            <div className="user-info">
              <p>Welcome, {user.firstName}</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            ))}
            <button className="sidebar-item logout" onClick={handleLogout}>
              <span className="sidebar-item-icon">🚪</span>
              <span className="sidebar-item-label">Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>{getTabTitle(activeTab)}</h1>
            <div className="header-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setActiveTab('cart')}
              >
                Cart ({cartItems.length})
              </button>
            </div>
          </div>
          <div className="dashboard-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ user, orders, favorites }) => {
  return (
    <div className="buyer-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>Welcome back, {user.firstName}!</h2>
          <p>Ready to discover fresh, organic produce from local farmers?</p>
        </div>
        <div className="quick-actions">
          <button 
            className="quick-action-btn primary" 
            onClick={() => window.location.hash = '#/products'}
          >
            <span className="icon">🛒</span>
            Browse Products
          </button>
          <button 
            className="quick-action-btn secondary" 
            onClick={() => window.location.hash = '#/orders'}
          >
            <span className="icon">📦</span>
            Track Orders
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{orders.length || 0}</h3>
            <p>Total Orders</p>
            <span className="stat-trend">+2 this month</span>
          </div>
        </div>
        <div className="stat-card favorites">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{favorites.length || 0}</h3>
            <p>Favorite Items</p>
            <span className="stat-trend">5 new items</span>
          </div>
        </div>
        <div className="stat-card spending">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Rs. 0</h3>
            <p>Total Spent</p>
            <span className="stat-trend">This month</span>
          </div>
        </div>
        <div className="stat-card savings">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Rs. 0</h3>
            <p>Money Saved</p>
            <span className="stat-trend">vs market price</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Orders</h3>
          <button 
            className="view-all-btn" 
            onClick={() => window.location.hash = '#/orders'}
          >
            View All
          </button>
        </div>
        <div className="orders-preview">
          {orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <div key={order._id} className="order-preview-card">
                <div className="order-info">
                  <h4>Order #{order._id.substring(0, 8)}</h4>
                  <p>{order.items?.length || 0} items • Rs. {order.total}</p>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p>No orders yet</p>
              <button 
                className="start-shopping-btn" 
                onClick={() => window.location.hash = '#/products'}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Products Tab
const ProductsTab = ({ products, onAddToCart }) => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock products data for demonstration
  const mockProducts = [
    {
      _id: '1',
      name: 'Fresh Tomatoes',
      price: 80,
      unit: 'kg',
      description: 'Organic red tomatoes from local farms',
      stock: 50,
      category: { name: 'Vegetables' },
      images: []
    },
    {
      _id: '2',
      name: 'Green Apples',
      price: 120,
      unit: 'kg',
      description: 'Crisp and juicy green apples',
      stock: 30,
      category: { name: 'Fruits' },
      images: []
    },
    {
      _id: '3',
      name: 'Fresh Spinach',
      price: 60,
      unit: 'bunch',
      description: 'Organic leafy greens',
      stock: 40,
      category: { name: 'Leafy Greens' },
      images: []
    }
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = categoryFilter === 'all' || 
      product.category?.name?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <div className="placeholder-image">🥬</div>
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="product-price">Rs. {product.price}/{product.unit}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-stock">Stock: {product.stock} {product.unit}</p>
                {product.category && (
                  <span className="product-category">{product.category.name}</span>
                )}
              </div>
              <div className="product-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => onAddToCart(product._id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
  );
};

// Cart Tab
const CartTab = ({ cartItems, loading, onProceedToCheckout }) => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // Initialize quantities from cart items
    const initialQuantities = {};
    cartItems.forEach(item => {
      initialQuantities[item.product._id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const updateQuantity = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const removeFromCart = async (productId) => {
    try {
      const token = authAPI.getAuthToken();
      const response = await cartAPI.removeFromCart(token, productId);
      if (response.success) {
        toast.success('Item removed from cart');
        // Update local state
        setQuantities(prev => {
          const newQuantities = { ...prev };
          delete newQuantities[productId];
          return newQuantities;
        });
      } else {
        toast.error(response.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * (quantities[item.product._id] || item.quantity));
    }, 0);
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  const total = calculateTotal();
  const deliveryFee = total > 0 && total < 1000 ? 50 : 0;
  const finalTotal = total + deliveryFee;

  return (
    <div className="cart-tab">
      <h3>Shopping Cart</h3>
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-image">
                  <div className="placeholder-image">🥬</div>
                </div>
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p className="item-price">Rs. {item.product.price}/{item.product.unit}</p>
                </div>
                <div className="item-controls">
                  <div className="quantity-control">
                    <button 
                      onClick={() => updateQuantity(item.product._id, Math.max(1, (quantities[item.product._id] || item.quantity) - 1))}
                    >
                      -
                    </button>
                    <span>{quantities[item.product._id] || item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product._id, (quantities[item.product._id] || item.quantity) + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="item-total">
                    Rs. {(item.product.price * (quantities[item.product._id] || item.quantity)).toFixed(2)}
                  </p>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Delivery Fee:</span>
              <span>Rs. {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>Rs. {finalTotal.toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-primary checkout-btn"
              onClick={onProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.hash = '#/products'}
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

// Orders Tab
const OrdersTab = ({ orders, loading }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());

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
            <div key={order._id} className="order-item">
              <div className="order-header">
                <h4>Order #{order._id.substring(0, 8)}</h4>
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
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: Rs. {order.total}</span>
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
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
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.hash = '#/products'}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Favorites Tab
const FavoritesTab = () => {
  // Mock favorites data
  const mockFavorites = [
    { id: 1, name: 'Organic Tomatoes', price: 'Rs. 80/kg', farmer: 'Green Farm' },
    { id: 2, name: 'Fresh Spinach', price: 'Rs. 60/bunch', farmer: 'Leafy Greens Co.' }
  ];

  return (
    <div className="favorites-tab">
      <div className="tab-header">
        <h3>Favorite Items</h3>
        <p>{mockFavorites.length} items in your favorites</p>
      </div>
      
      <div className="favorites-grid">
        {mockFavorites.length > 0 ? (
          mockFavorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <div className="favorite-icon">🥬</div>
              <h4>{item.name}</h4>
              <p className="item-price">{item.price}</p>
              <small>Farmer: {item.farmer}</small>
              <div className="item-actions">
                <button className="btn btn-primary">Add to Cart</button>
                <button className="btn btn-outline remove-btn">Remove</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No favorite items yet</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.hash = '#/products'}
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Payments Tab
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
      <div className="payment-method">
        <h4>Cash on Delivery</h4>
        <p>Pay when you receive your order</p>
        <button className="btn btn-outline">Default</button>
      </div>
    </div>
  </div>
);

// Delivery Tab
const DeliveryTab = ({ user }) => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: user.address || 'Ward 5, Thamel, Kathmandu',
      city: user.city || 'Kathmandu',
      isDefault: true
    }
  ]);

  return (
    <div className="delivery-tab">
      <div className="tab-header">
        <h3>Delivery Addresses</h3>
        <button className="btn btn-primary">
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
              <button className="btn btn-outline">Edit</button>
              {!address.isDefault && (
                <button className="btn btn-outline">Set as Default</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reviews Tab
const ReviewsTab = () => (
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
);

// Profile Tab
const ProfileTab = ({ user }) => (
  <div className="profile-tab">
    <div className="tab-header">
      <h3>My Profile</h3>
    </div>
    
    <div className="profile-content">
      <div className="profile-info">
        <div className="info-group">
          <label>Full Name</label>
          <p>{user.firstName} {user.lastName}</p>
        </div>
        <div className="info-group">
          <label>Username</label>
          <p>{user.username}</p>
        </div>
        <div className="info-group">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
        <div className="info-group">
          <label>Phone</label>
          <p>{user.phone}</p>
        </div>
        <div className="info-group">
          <label>Address</label>
          <p>{user.address}</p>
        </div>
        <div className="info-group">
          <label>City</label>
          <p>{user.city}</p>
        </div>
      </div>
      <button className="btn btn-primary">Edit Profile</button>
    </div>
  </div>
);

// Settings Tab
const SettingsTab = () => (
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
);

export default BuyerDashboard;