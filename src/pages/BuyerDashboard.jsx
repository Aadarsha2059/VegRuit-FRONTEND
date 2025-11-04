import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartAPI } from '../services/cartAPI';
import { orderAPI } from '../services/orderAPI';
import { authAPI } from '../services/authAPI';
import { productAPI } from '../services/productAPI';
import Calendar from '../components/Calendar';

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (activeTab === 'products') {
        setLoading(prev => ({ ...prev, products: true }));
        try {
          const response = await productAPI.getPublicProducts();
          if (response.success) {
            setProducts(response.data.products || []);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
        } finally {
          setLoading(prev => ({ ...prev, products: false }));
        }
      }
    };
    
    fetchProducts();
  }, [activeTab]);

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
          } else {
            throw new Error(response.message || 'Failed to load orders');
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to load orders: ' + error.message);
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
        // Update cart count in header
        const cartResponse = await cartAPI.getCart(token);
        if (cartResponse.success) {
          setCartItems(cartResponse.data.items || []);
        }
      } else {
        toast.error(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Toggle favorite function
  const handleToggleFavorite = async (productId) => {
    try {
      // For now, just show a success message since we don't have backend favorites
      const isCurrentlyFavorite = favorites.some(fav => fav.id === productId);
      
      if (isCurrentlyFavorite) {
        setFavorites(prev => prev.filter(fav => fav.id !== productId));
        toast.success('Removed from favorites!');
      } else {
        // Find the product and add to favorites
        const product = products.find(p => p._id === productId);
        if (product) {
          setFavorites(prev => [...prev, {
            id: product._id,
            name: product.name,
            price: `Rs. ${product.price}/${product.unit}`,
            image: product.images?.[0] || '',
            farmer: 'Local Farmer'
          }]);
          toast.success('Added to favorites!');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
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
        return <FavoritesTab 
          favorites={favorites} 
          onAddToCart={handleAddToCart}
          onRemoveFromFavorites={(productId) => {
            setFavorites(prev => prev.filter(fav => fav.id !== productId));
            toast.success('Removed from favorites!');
          }}
        />;
      case 'payments':
        return <PaymentsTab />;
      case 'delivery':
        return <DeliveryTab user={user} />;
      case 'reviews':
        return <ReviewsTab orders={orders} />;
      case 'profile':
        return <ProfileTab user={user} orders={orders} />;
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
              <Calendar compact={true} />
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
  const [loading, setLoading] = useState(false);

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || 
      product.category?.name?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category?.name).filter(Boolean))];

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
            {categories.map((category, index) => (
              <option key={index} value={category.toLowerCase()}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-item">
                <div className="product-image">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="placeholder-image" style={{display: product.images && product.images.length > 0 ? 'none' : 'flex'}}>
                    🥬
                  </div>
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
                  <button 
                    className="btn btn-outline favorite-btn"
                    onClick={() => handleToggleFavorite(product._id)}
                    title="Add to Favorites"
                  >
                    ❤️
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
      )}
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

  const updateQuantity = async (productId, newQuantity) => {
    // Update local state immediately for UI responsiveness
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));

    // Update backend
    try {
      const token = authAPI.getAuthToken();
      if (newQuantity > 0) {
        await cartAPI.updateCartItem(token, productId, newQuantity);
      } else {
        await cartAPI.removeFromCart(token, productId);
        // Update local state to remove item
        setQuantities(prev => {
          const newQuantities = { ...prev };
          delete newQuantities[productId];
          return newQuantities;
        });
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart item');
      // Revert local state on error
      const cartResponse = await cartAPI.getCart(token);
      if (cartResponse.success) {
        const updatedQuantities = {};
        cartResponse.data.items.forEach(item => {
          updatedQuantities[item.product._id] = item.quantity;
        });
        setQuantities(updatedQuantities);
      }
    }
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
                  {item.product.images && item.product.images.length > 0 ? (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="placeholder-image" style={{display: item.product.images && item.product.images.length > 0 ? 'none' : 'flex'}}>
                    🥬
                  </div>
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
              Proceed to Checkout (Cash on Delivery)
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
            <option value="shipped">Shipped</option>
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
                <div>
                  <h4>Order #{order._id?.substring(0, 8)}</h4>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`order-status status-${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-items">
                <h5>Items Ordered</h5>
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <div className="order-item-image">
                      {item.productImage ? (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="order-placeholder-image" style={{display: item.productImage ? 'none' : 'flex'}}>
                        🥬
                      </div>
                    </div>
                    <div className="order-item-info">
                      <span className="item-name">{item.productName}</span>
                      <span className="item-quantity">Qty: {item.quantity} {item.unit || 'kg'}</span>
                      <span className="item-price">Rs. {item.price}</span>
                      <span className="item-total">Total: Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-totals">
                  <p><strong>Subtotal:</strong> Rs. {order.totalAmount?.toFixed(2)}</p>
                  <p><strong>Delivery Fee:</strong> Rs. {order.deliveryFee?.toFixed(2)}</p>
                  <p className="order-total"><strong>Total:</strong> Rs. {order.finalAmount?.toFixed(2)}</p>
                </div>
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
const FavoritesTab = ({ favorites, onAddToCart, onRemoveFromFavorites }) => {
  return (
    <div className="favorites-tab">
      <div className="tab-header">
        <h3>❤️ Favorite Items</h3>
        <p>{favorites.length} items in your favorites</p>
      </div>
      
      <div className="favorites-grid">
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <div className="favorite-image">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="favorite-placeholder" style={{display: item.image ? 'none' : 'flex'}}>
                  🥬
                </div>
              </div>
              <div className="favorite-content">
                <h4>{item.name}</h4>
                <p className="item-price">{item.price}</p>
                <small>Farmer: {item.farmer}</small>
                <div className="item-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => onAddToCart(item.id)}
                  >
                    🛒 Add to Cart
                  </button>
                  <button 
                    className="btn btn-outline remove-btn"
                    onClick={() => onRemoveFromFavorites(item.id)}
                  >
                    💔 Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <div className="empty-icon">💔</div>
            <h3>No Favorite Items Yet</h3>
            <p>Start adding products to your favorites by clicking the ❤️ button on products you love!</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveTab('products')}
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Payments Tab
const PaymentsTab = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'cod', name: 'Cash on Delivery', connected: true, default: true },
    { id: 'khalti', name: 'Khalti', connected: false, default: false },
    { id: 'esewa', name: 'eSewa', connected: false, default: false }
  ]);
  const [transactions, setTransactions] = useState([
    { id: 1, orderId: 'TS240001', amount: 1250, method: 'Cash on Delivery', date: '2024-11-01', status: 'completed' },
    { id: 2, orderId: 'TS240002', amount: 890, method: 'Cash on Delivery', date: '2024-10-28', status: 'completed' }
  ]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleConnectPayment = (methodId) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, connected: !method.connected }
          : method
      )
    );
    toast.success(`Payment method ${methodId === 'khalti' ? 'Khalti' : 'eSewa'} ${paymentMethods.find(m => m.id === methodId)?.connected ? 'disconnected' : 'connected'}!`);
  };

  const handleSetDefault = (methodId) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        default: method.id === methodId
      }))
    );
    toast.success('Default payment method updated!');
  };

  return (
    <div className="enhanced-payments-tab">
      <div className="payments-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            ← Back
          </button>
          <div className="header-content">
            <h2>💳 Payment Methods</h2>
            <p>Manage your payment options and transaction history</p>
          </div>
        </div>
      </div>

      <div className="payments-content">
        <div className="payment-methods-section">
          <h3>Available Payment Methods</h3>
          <div className="payment-methods-grid">
            {paymentMethods.map((method) => (
              <div key={method.id} className={`payment-method-card ${method.connected ? 'connected' : ''}`}>
                <div className="method-icon">
                  {method.id === 'cod' && '💵'}
                  {method.id === 'khalti' && '📱'}
                  {method.id === 'esewa' && '💳'}
                </div>
                <div className="method-info">
                  <h4>{method.name}</h4>
                  <p>
                    {method.id === 'cod' && 'Pay when you receive your order'}
                    {method.id === 'khalti' && 'Digital wallet payment'}
                    {method.id === 'esewa' && 'Online payment gateway'}
                  </p>
                  <div className="method-status">
                    {method.connected ? (
                      <span className="status-badge connected">✅ Connected</span>
                    ) : (
                      <span className="status-badge disconnected">❌ Not Connected</span>
                    )}
                    {method.default && (
                      <span className="default-badge">⭐ Default</span>
                    )}
                  </div>
                </div>
                <div className="method-actions">
                  {method.id !== 'cod' && (
                    <button 
                      className={`connect-btn ${method.connected ? 'disconnect' : 'connect'}`}
                      onClick={() => handleConnectPayment(method.id)}
                    >
                      {method.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  )}
                  {method.connected && !method.default && (
                    <button 
                      className="default-btn"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <h4>Order #{transaction.orderId}</h4>
                    <p className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</p>
                    <p className="payment-method">via {transaction.method}</p>
                  </div>
                  <div className="transaction-amount">
                    <span className="amount">Rs. {transaction.amount.toLocaleString()}</span>
                    <span className={`status ${transaction.status}`}>
                      {transaction.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-transactions">
                <div className="empty-icon">💳</div>
                <h4>No Transactions Yet</h4>
                <p>Your payment history will appear here after you make purchases</p>
              </div>
            )}
          </div>
        </div>

        <div className="payment-security">
          <h3>🔒 Payment Security</h3>
          <div className="security-features">
            <div className="security-item">
              <span className="security-icon">🛡️</span>
              <div className="security-info">
                <h4>Secure Transactions</h4>
                <p>All payments are encrypted and secure</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">🔐</span>
              <div className="security-info">
                <h4>Data Protection</h4>
                <p>Your payment information is never stored</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">💯</span>
              <div className="security-info">
                <h4>Money Back Guarantee</h4>
                <p>100% refund if you're not satisfied</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};;

// Enhanced Delivery Tab
const DeliveryTab = ({ user }) => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'Home Address',
      address: user?.address || 'Ward 5, Thamel, Kathmandu',
      city: user?.city || 'Kathmandu',
      phone: user?.phone || '+977 9841234567',
      landmark: 'Near Ratna Park',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'Office Address',
      address: 'Putalisadak, Kathmandu',
      city: 'Kathmandu',
      phone: '+977 9841234567',
      landmark: 'Near City Centre',
      isDefault: false
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    address: '',
    city: '',
    phone: '',
    landmark: ''
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    const address = {
      id: Date.now(),
      ...newAddress,
      isDefault: addresses.length === 0
    };

    setAddresses(prev => [...prev, address]);
    setNewAddress({ type: 'Home', name: '', address: '', city: '', phone: '', landmark: '' });
    setShowAddForm(false);
    toast.success('Address added successfully!');
  };

  const handleSetDefault = (addressId) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
    toast.success('Default address updated!');
  };

  const handleDeleteAddress = (addressId) => {
    if (addresses.length === 1) {
      toast.error('You must have at least one address');
      return;
    }
    
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast.success('Address deleted successfully!');
  };

  const deliveryZones = [
    { area: 'Kathmandu Valley', fee: 'Free', time: '1-2 hours' },
    { area: 'Bhaktapur', fee: 'Rs. 50', time: '2-3 hours' },
    { area: 'Lalitpur', fee: 'Rs. 30', time: '1-2 hours' },
    { area: 'Outside Valley', fee: 'Rs. 150', time: '1-2 days' }
  ];

  return (
    <div className="enhanced-delivery-tab">
      <div className="delivery-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            ← Back
          </button>
          <div className="header-content">
            <h2>🚚 Delivery Management</h2>
            <p>Manage your delivery addresses and preferences</p>
          </div>
        </div>
        <button 
          className="add-address-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Address
        </button>
      </div>

      <div className="delivery-content">
        <div className="addresses-section">
          <h3>📍 Saved Addresses</h3>
          <div className="addresses-grid">
            {addresses.map((address) => (
              <div key={address.id} className="address-card">
                <div className="address-header">
                  <div className="address-type">
                    <span className="type-icon">
                      {address.type === 'Home' ? '🏠' : address.type === 'Office' ? '🏢' : '📍'}
                    </span>
                    <h4>{address.name}</h4>
                  </div>
                  {address.isDefault && (
                    <span className="default-badge">⭐ Default</span>
                  )}
                </div>
                
                <div className="address-details">
                  <p className="address-text">📍 {address.address}</p>
                  <p className="address-city">🏙️ {address.city}</p>
                  <p className="address-phone">📞 {address.phone}</p>
                  {address.landmark && (
                    <p className="address-landmark">🗺️ {address.landmark}</p>
                  )}
                </div>
                
                <div className="address-actions">
                  <button className="action-btn edit">✏️ Edit</button>
                  {!address.isDefault && (
                    <button 
                      className="action-btn default"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      ⭐ Set Default
                    </button>
                  )}
                  {addresses.length > 1 && (
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAddForm && (
          <div className="add-address-form">
            <h3>➕ Add New Address</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Address Type</label>
                <select 
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                >
                  <option value="Home">🏠 Home</option>
                  <option value="Office">🏢 Office</option>
                  <option value="Other">📍 Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Address Name *</label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  placeholder="e.g., Home, Office, Mom's House"
                />
              </div>
              <div className="form-group full-width">
                <label>Full Address *</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  placeholder="House/Building number, Street, Ward"
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  placeholder="Kathmandu"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              <div className="form-group full-width">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                  placeholder="Near temple, school, or any recognizable place"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={handleAddAddress}>
                💾 Save Address
              </button>
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        <div className="delivery-zones-section">
          <h3>🗺️ Delivery Zones & Charges</h3>
          <div className="zones-grid">
            {deliveryZones.map((zone, index) => (
              <div key={index} className="zone-card">
                <h4>{zone.area}</h4>
                <div className="zone-details">
                  <div className="zone-fee">
                    <span className="label">Delivery Fee:</span>
                    <span className="value">{zone.fee}</span>
                  </div>
                  <div className="zone-time">
                    <span className="label">Delivery Time:</span>
                    <span className="value">{zone.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="delivery-preferences">
          <h3>⚙️ Delivery Preferences</h3>
          <div className="preferences-grid">
            <div className="preference-item">
              <h4>🕐 Preferred Time Slot</h4>
              <select className="preference-select">
                <option value="anytime">Anytime (8AM - 8PM)</option>
                <option value="morning">Morning (8AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
            <div className="preference-item">
              <h4>📞 Contact Preference</h4>
              <select className="preference-select">
                <option value="call">Call before delivery</option>
                <option value="sms">SMS notification only</option>
                <option value="both">Both call and SMS</option>
              </select>
            </div>
            <div className="preference-item">
              <h4>📦 Special Instructions</h4>
              <textarea 
                className="preference-textarea"
                placeholder="Any special delivery instructions..."
                rows="3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Reviews Tab
const ReviewsTab = ({ orders }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      orderId: 'TS240001',
      productName: 'Organic Tomatoes',
      productImage: '',
      rating: 5,
      review: 'Excellent quality tomatoes! Fresh and organic as promised. Will definitely order again.',
      date: '2024-11-01',
      farmerName: 'Green Valley Farm',
      helpful: 12
    },
    {
      id: 2,
      orderId: 'TS240002',
      productName: 'Fresh Spinach',
      productImage: '',
      rating: 4,
      review: 'Good quality spinach, delivered fresh. Packaging could be better.',
      date: '2024-10-28',
      farmerName: 'Leafy Greens Co.',
      helpful: 8
    }
  ]);
  const [pendingReviews, setPendingReviews] = useState([
    {
      orderId: 'TS240003',
      productName: 'Organic Carrots',
      productImage: '',
      deliveredDate: '2024-11-03'
    }
  ]);
  const [activeTab, setActiveTab] = useState('my-reviews');
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: '',
    orderId: ''
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmitReview = (orderId) => {
    if (!newReview.review.trim()) {
      toast.error('Please write a review');
      return;
    }

    const review = {
      id: Date.now(),
      orderId,
      productName: pendingReviews.find(p => p.orderId === orderId)?.productName,
      productImage: pendingReviews.find(p => p.orderId === orderId)?.productImage || '',
      rating: newReview.rating,
      review: newReview.review,
      date: new Date().toISOString().split('T')[0],
      farmerName: 'Local Farm',
      helpful: 0
    };

    setReviews(prev => [review, ...prev]);
    setPendingReviews(prev => prev.filter(p => p.orderId !== orderId));
    setNewReview({ rating: 5, review: '', orderId: '' });
    toast.success('Review submitted successfully!');
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="enhanced-reviews-tab">
      <div className="reviews-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            ← Back
          </button>
          <div className="header-content">
            <h2>⭐ Reviews & Ratings</h2>
            <p>Share your experience and help other customers</p>
          </div>
        </div>
      </div>

      <div className="reviews-stats">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{reviews.length}</h3>
            <p>Reviews Written</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👍</div>
          <div className="stat-content">
            <h3>{reviews.reduce((sum, r) => sum + r.helpful, 0)}</h3>
            <p>Helpful Votes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{pendingReviews.length}</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-content">
            <h3>{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="reviews-tabs">
        <button 
          className={`tab-btn ${activeTab === 'my-reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-reviews')}
        >
          📝 My Reviews ({reviews.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Reviews ({pendingReviews.length})
        </button>
      </div>

      <div className="reviews-content">
        {activeTab === 'my-reviews' && (
          <div className="my-reviews-section">
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="product-info">
                        <div className="product-image">
                          {review.productImage ? (
                            <img src={review.productImage} alt={review.productName} />
                          ) : (
                            <div className="placeholder">🥬</div>
                          )}
                        </div>
                        <div className="product-details">
                          <h4>{review.productName}</h4>
                          <p>Order #{review.orderId}</p>
                          <p className="farmer-name">by {review.farmerName}</p>
                        </div>
                      </div>
                      <div className="review-meta">
                        {renderStars(review.rating)}
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="review-content">
                      <p>{review.review}</p>
                    </div>
                    
                    <div className="review-footer">
                      <div className="helpful-section">
                        <span className="helpful-count">👍 {review.helpful} people found this helpful</span>
                      </div>
                      <div className="review-actions">
                        <button className="action-btn edit">✏️ Edit</button>
                        <button className="action-btn delete">🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <div className="empty-icon">⭐</div>
                <h3>No Reviews Yet</h3>
                <p>Start shopping and leave reviews to help other customers!</p>
                <button 
                  className="browse-btn"
                  onClick={() => setActiveTab('products')}
                >
                  🛒 Browse Products
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="pending-reviews-section">
            {pendingReviews.length > 0 ? (
              <div className="pending-list">
                {pendingReviews.map((item) => (
                  <div key={item.orderId} className="pending-review-card">
                    <div className="pending-header">
                      <div className="product-info">
                        <div className="product-image">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} />
                          ) : (
                            <div className="placeholder">🥬</div>
                          )}
                        </div>
                        <div className="product-details">
                          <h4>{item.productName}</h4>
                          <p>Order #{item.orderId}</p>
                          <p className="delivered-date">Delivered on {new Date(item.deliveredDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="review-form">
                      <div className="rating-section">
                        <label>Rate this product:</label>
                        {renderStars(newReview.orderId === item.orderId ? newReview.rating : 5, true, (rating) => 
                          setNewReview(prev => ({ ...prev, rating, orderId: item.orderId }))
                        )}
                      </div>
                      
                      <div className="review-input">
                        <textarea
                          placeholder="Share your experience with this product..."
                          value={newReview.orderId === item.orderId ? newReview.review : ''}
                          onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value, orderId: item.orderId }))}
                          rows="4"
                        />
                      </div>
                      
                      <button 
                        className="submit-review-btn"
                        onClick={() => handleSubmitReview(item.orderId)}
                      >
                        📝 Submit Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-pending">
                <div className="empty-icon">✅</div>
                <h3>All Caught Up!</h3>
                <p>You've reviewed all your recent purchases. Thank you for your feedback!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};;

// Enhanced Profile Tab
const ProfileTab = ({ user, orders }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setState({
    firstN
    || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    bio: user?
    preferences: user?.preferences || {
      organic: true,
      local: true,
      notifica
    }
  });

  const handle) => {
    navigate(-1);
  };

  const handle{
    // Save profile data logic here
    setEditMode(false);
    toast.success('Profile upda
  };

  const handleInputChange = (
    setProfileData(prev => ({
      ...prev,
      [fieldlue
    }));
  };

   {
{
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.p]
      }
    }));
  };

  const memberSince = user?.createdAt ? new Date(user.crear();
  const tota || 0;
  const totalSpent = orders?.reduce((s

  return (
    <div className="enhanced-profile-tab">
      <div c>
        <div className="header-left">
          <button className="b}>
            ← Back
          </button>
          <dntent">
            <h2>👤 My Profile</h2>
            <p>Manage yo
          </div>
        </div>
        <button 
          btn"
        tMode)}
        >
ofile'}
        </button> </div> class
  );
};>   </divdiv>
      </v>
 di   </    iv>
     </d
      nt</button>e Accou">🗑️ Delette-btn dele"actionsName=clas <button            tton>
ta</bu Export Da">📥-btn exportction"asName= clas    <button
        /button>tings<et Privacy Sy">🛡️n-btn privace="actioassNamclbutton         <n>
    buttosword</nge Pashay">🔒 Cecuritn son-bt="actissName<button cla         grid">
   "actions-e=am <div classN
         >s</h4Actioncount  Ac<h4>🔧       s">
   ionount-actame="acciv classN  <d            )}

v>
      </di
      >tton       </bu    ancel
    ❌ C         )}>
  (falsetEditMode=> se={() nClick otn"="cancel-bon classNameutt        <b
    on> </butt          
 anges  💾 Save Ch            dleSave}>
nClick={hanve-btn" oame="satton classN       <bu
     ns">le-actioe="profiv classNam      <di(
    ode &&      {editMdiv>

          </ </div>
 
         /div>      <        </div>
          
   </label>            
   ></span>r"me="slidespan classNa           <   />
                 ode}
     {!editMsabled=  di               )}
   ions'tificatChange('noceenPrefer handle={() =>hangeonC                   alse}
 ns || f.notificatios?ncerefeeData.prerofilked={p        chec         
   kbox" hec="ctype                      <input 
        
        ">ch"toggle-switame=abel classN  <l          iv>
     </d         
      rs</p>ur ordeut yoabos ateupd<p>Receive          
         5>/hfications<r Notide  <h5>🔔 Or             ">
   nforence-ime="prefeNa  <div class           tem">
   reference-iName="pdiv class    <  
                  iv>
          </d    label>
          </       /span>
   slider"><lassName="n c   <spa             />
                 e}
   Moditbled={!ed       disa            al')}
 nge('locreferenceChaleP hande={() =>Chang   on                | false}
 ocal |?.lferencesleData.preofid={prchecke                 ox" 
   checkb     type="             input 
     <             
  ch">ittoggle-swe="l classNam <labe            >
          </div   
      rs</p>l farme loca fromize productsPriorit         <p>        </h5>
 ocal Farmersrt L🏠 Suppo     <h5>         nfo">
    erence-ime="prefssNa claiv     <d   
        m">erence-iteme="preflassNa<div c        
           
          </div>          bel>
   /la   <     
        "></span>"sliderassName= <span cl        
                   />    
    ode}{!editMbled=  disa             
     }anic')hange('orgPreferenceC=> handleChange={()         on          false}
    ||s?.organiccea.preferenleDatecked={profi    ch          x" 
      botype="check                   
 ut np   <i              ">
 -switchtogglessName="la c<label        >
           </div            ults</p>
 ch resarst in ses firoductc pr organi<p>Show          
        s</h5>uctanic Prod Prefer Org  <h5>🌱       
         ">nfoference-i="preameassN    <div cl         
   ce-item">"preferensName=<div clas            -list">
  erencesme="pref<div classNa            >
erences</h4ng Pref Shoppi<h4>⚙️        on">
    ecti-sncesfere"preName=v class    <di  

    >    </divdiv>
            </       )}
            /span>
 d yet'}<bio addeio || 'No eData.brofilspan>{p          <      : (
       )       
      />          ws="3"
     ro            ..."
  urselfyoout s ab="Tell uplaceholder                  alue)}
e.target.v'bio', nputChange( handleInge={(e) =>nCha        o       o}
   Data.bifile={pro  value            tarea
        <tex           de ? (
 ditMo      {e     abel>
   label>Bio</l       <      >
 ll-width"tem ful-ie="detaidiv classNam           <         
    </div>
      }
          )         '}</span>
 fiedpeci || 'Not sddressrofileData.a  <span>{p          (
            ) :  />
              "
       ="2  rows                
alue)}rget.vs', e.tadresutChange('adandleInp => hge={(e)onChan               dress}
   .adfileDataprolue={      va            <textarea
             
    (e ?Mod       {edit  el>
     ess</label>Addr    <lab         width">
 ull-tem f"detail-ilassName=   <div c        
             
v> </di       iv>
      </d          
   )}        
       </span>ified'}ot spec || 'NleData.cityspan>{profi       <             ) : (
               />
                 t.value)}
.targey', e'cittChange(> handleInpunge={(e) =     onCha            ity}
   a.catleDe={profi     valu     
          ""textype=  t             ut
          <inp      
        ? ({editMode           el>
     el>City</lab <lab               em">
etail-itssName="div cla<d           
           iv>
               </d   )}
             span>
     '}</cified || 'Not speonea.phileDat <span>{prof         
         (       ) :        />
                  
 lue)}.va', e.targetge('phoneInputChan handle) =>={(engeonCha                one}
    ata.pheD={profil     value              l"
  type="te           
        put   <in        
       e ? (ditMod     {e
           bel>r</laone NumbePh     <label>          -item">
 "detailName=lass      <div c     
                 v>
   </di         
          )}>
        /spanspecified'}< 'Not mail ||.eeDatan>{profil<spa                 : (
             ) />
              )}
        valuee.target.', hange('emailtCInpule(e) => handhange={      onC           
   eData.email}={profil  value               "
   "email    type=       
            <input             (
   ditMode ?    {e  
          </label>essl>Email Addr     <labe
           l-item">detaime="lassNaiv c    <d
                     
       </div>             )}
             n>
}</spa specified'e || 'NotrnamfileData.useroan>{p   <sp                 ) : (
                    />
          alue)}
  et.vrgme', e.tasernage('unputChandleIange={(e) => honChan             e}
       amData.usernleue={profi val                  text"
 "   type=         
           <input          (
      Mode ?it  {ed           bel>
   sername</la<label>U             tem">
   il-iame="detaiv classN    <d          
         v>
       </di             )}
            
   d'}</span>cifiet spetName || 'Noa.las{profileDatan>  <sp                 (
    ) :          />
                  e)}
  .value.targetame', ge('lastNhanputC=> handleIne={(e)    onChang          
       lastName}rofileData.value={p                  text"
  pe="          ty      put
            <in          (
Mode ?     {edit   
         me</label>st Naabel>La         <l>
       item"me="detail-classNadiv      <                 
     v>
         </di        )}
             '}</span>
 ied'Not specifame || stNeData.firpan>{profil<s                     ) : (
                   />
         }
   arget.value)tName', e.trs('fiutChangeInp => handleange={(e)Ch     on              }
 Name.firstileDataprofue={      val          
    pe="text"       ty          
   put    <in              ode ? (
 {editM            bel>
   st Name</lael>Fir      <lab        ">
  detail-item="Namev class     <di
         s-grid">"detailassName=    <div cl4>
        tion</hal InformaPerson<h4>📋        
     section">ils-Name="detaassdiv cl          <">
ailsdet"profile- className=     <div   </div>

 >
        </div    v>
           </din>
      /spaints Earned<-label">Po"statclassName=  <span             </span>
100)}nt / talSper(to{Math.flooe">lu="stat-van className        <spam">
      e="stat-itev classNam  <di         >
   </div       </span>
   l Spentabel">Totastat-lme=" classNaan   <sp         >
  ng()}</spanrialeStLoct.tootalSpen>Rs. {te"stat-valusName="  <span clas          tem">
  e="stat-issNam   <div cla
           </div>         n>
 s</spabel">Order"stat-lame=lassNa    <span c     n>
     rders}</spaue">{totalOtat-val"s className=span    <          
-item">statsName="v clas         <di   e-stats">
"profilName=ass  <div cl       div>

  </       /div>
            <  }
Lover</span>ganic anic">🌱 Or"badge orgame=n classN& <spa.organic &eferences?eData.pr    {profil   
       span>}</mertol Cus Loyaoyal">⭐e l"badg className= && <span 10ders >Or   {total      pan>
     ified</s">✅ Verifieddge verbae="sNamn clas       <spa
       e-badges">filro"pclassName=iv     <d>
        nce}</p {memberSisinceber e">🗓️ Memember-sinclassName="m    <p c>
        }</pmeData.usernaileof>@{pr"username"e= <p classNam           >
ame}</h3tN.lastafileDa{proe} tNamfirsData.le>{profi     <h3     
  mmary">rofile-su"pssName=<div cla   
          
       v>/di    <>
      uttonPhoto</b">📷 Change -avatar-btnme="uploadassNabutton cl        <>
    </div           
 se() || 'U'}.toUpperCa0)??.charAt(irstNamea.frofileDat       {p      rcle">
 -citarme="avassNav cla<di        
    ">avatarprofile-me="div classNa
          <verview">e-oprofilclassName="       <div ">
 entfile-contro"pName=
      <div

     it Pr '✏️ EdChanges' :💾 Save  ? '{editMode          ode(!ediitM => setEdClick={()  onprofile-"edit-sName=clasferences</p>tion and preformainl narsour peeader-coe="hlassNamiv chandleGoBack={Clickton" onack-butheader"profile-Name="lass 0; 0), 0) ||al ||der.tot=> sum + (or order) um,ders?.lengthders = orlOretFullYete().g: new DaullYear() dAt).getFateerencerences[prefrefea(prev => (tProfileDat    seerence) =>prefhange = (PreferenceC handlestcon;

// Settings Tab
// Enhanced Settings Tab
const SettingsTab = ({ user }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareData: false,
    marketingEmails: false
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preferences updated!');
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Privacy settings updated!');
  };

  return (
    <div className="enhanced-settings-tab">
      <div className="settings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            ← Back
          </button>
          <div className="header-content">
            <h2>⚙️ Account Settings</h2>
            <p>Manage your account preferences and security</p>
          </div>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <div className="settings-nav">
            <button 
              className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              👤 Account
            </button>
            <button 
              className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              🔔 Notifications
            </button>
            <button 
              className={`nav-item ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveSection('privacy')}
            >
              🛡️ Privacy
            </button>
            <button 
              className={`nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              🔒 Security
            </button>
            <button 
              className={`nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              🎯 Preferences
            </button>
          </div>
        </div>

        <div className="settings-content">
          {activeSection === 'account' && (
            <div className="settings-section">
              <h3>👤 Account Information</h3>
              <div className="account-settings">
                <div className="setting-card">
                  <div className="setting-info">
                    <h4>Personal Details</h4>
                    <p>Update your name, email, and contact information</p>
                  </div>
                  <button className="setting-btn">✏️ Edit Profile</button>
                </div>
                
                <div className="setting-card">
                  <div className="setting-info">
                    <h4>Change Password</h4>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button className="setting-btn">🔑 Change Password</button>
                </div>
                
                <div className="setting-card">
                  <div className="setting-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="setting-btn">🛡️ Enable 2FA</button>
                </div>
                
                <div className="setting-card">
                  <div className="setting-info">
                    <h4>Account Verification</h4>
                    <p>Verify your phone number and email address</p>
                  </div>
                  <button className="setting-btn">✅ Verify Account</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h3>🔔 Notification Preferences</h3>
              <div className="notification-settings">
                <div className="notification-group">
                  <h4>Order Notifications</h4>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h5>Order Updates</h5>
                      <p>Get notified about order status changes</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.orderUpdates}
                        onChange={() => handleNotificationChange('orderUpdates')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h5>SMS Notifications</h5>
                      <p>Receive text messages for important updates</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-group">
                  <h4>Marketing Communications</h4>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h5>Promotional Offers</h5>
                      <p>Receive notifications about deals and discounts</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.promotions}
                        onChange={() => handleNotificationChange('promotions')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-item">
                    <div className="notification-info">
                      <h5>Newsletter</h5>
                      <p>Stay updated with our weekly newsletter</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.newsletter}
                        onChange={() => handleNotificationChange('newsletter')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="settings-section">
              <h3>🛡️ Privacy Settings</h3>
              <div className="privacy-settings">
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Profile Visibility</h4>
                    <p>Control who can see your profile information</p>
                  </div>
                  <select className="privacy-select">
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Data Sharing</h4>
                    <p>Allow us to share anonymized data for research</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={privacy.shareData}
                      onChange={() => handlePrivacyChange('shareData')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h4>Marketing Emails</h4>
                    <p>Receive personalized marketing emails</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={privacy.marketingEmails}
                      onChange={() => handlePrivacyChange('marketingEmails')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="privacy-actions">
                  <h4>Data Management</h4>
                  <div className="data-actions">
                    <button className="data-btn export">📥 Export My Data</button>
                    <button className="data-btn delete">🗑️ Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <h3>🔒 Security Settings</h3>
              <div className="security-settings">
                <div className="security-item">
                  <div className="security-info">
                    <h4>Login Sessions</h4>
                    <p>Manage your active login sessions</p>
                  </div>
                  <button className="security-btn">👁️ View Sessions</button>
                </div>
                
                <div className="security-item">
                  <div className="security-info">
                    <h4>Login Alerts</h4>
                    <p>Get notified of suspicious login attempts</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="security-item">
                  <div className="security-info">
                    <h4>Account Recovery</h4>
                    <p>Set up account recovery options</p>
                  </div>
                  <button className="security-btn">🔧 Configure</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="settings-section">
              <h3>🎯 Shopping Preferences</h3>
              <div className="preferences-settings">
                <div className="preference-group">
                  <h4>Product Preferences</h4>
                  <div className="preference-item">
                    <label>Preferred Categories</label>
                    <div className="category-tags">
                      <span className="tag active">🥬 Vegetables</span>
                      <span className="tag">🍎 Fruits</span>
                      <span className="tag active">🌱 Organic</span>
                      <span className="tag">🥛 Dairy</span>
                    </div>
                  </div>
                  
                  <div className="preference-item">
                    <label>Budget Range</label>
                    <select className="preference-select">
                      <option value="any">Any Budget</option>
                      <option value="low">Under Rs. 500</option>
                      <option value="medium">Rs. 500 - 2000</option>
                      <option value="high">Above Rs. 2000</option>
                    </select>
                  </div>
                </div>
                
                <div className="preference-group">
                  <h4>Delivery Preferences</h4>
                  <div className="preference-item">
                    <label>Preferred Delivery Time</label>
                    <select className="preference-select">
                      <option value="anytime">Anytime</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                  
                  <div className="preference-item">
                    <label>Special Instructions</label>
                    <textarea 
                      className="preference-textarea"
                      placeholder="Any special delivery instructions..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;