import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI } from '../services/productAPI';
import './ProductNotifications.css';

const ProductNotifications = ({ onBrowseClick }) => {
  const [recentProducts, setRecentProducts] = useState(() => {
    // Load recent products from localStorage on mount
    try {
      const saved = localStorage.getItem('recentProducts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const lastProductIdsRef = useRef(() => {
    // Load last known product IDs from localStorage
    try {
      const saved = localStorage.getItem('lastProductIds');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  }());
  const isInitializedRef = useRef(false);

  // Save recent products to localStorage whenever they change and update unread count
  useEffect(() => {
    try {
      localStorage.setItem('recentProducts', JSON.stringify(recentProducts));
      const unread = recentProducts.filter(p => !p.read).length;
      setUnreadCount(unread);
      console.log('Updated unread count:', unread, 'from products:', recentProducts);
    } catch (e) {
      console.error('Error saving recent products:', e);
    }
  }, [recentProducts]);


  // Check for new products periodically
  useEffect(() => {
    const checkNewProducts = async () => {
      try {
        const response = await productAPI.getPublicProducts();
        if (response && response.success && response.data && response.data.products) {
          const currentProducts = response.data.products || [];
          const currentProductIds = new Set(currentProducts.map(p => p._id || p.id).filter(Boolean));
          
          // On first load, just store the product IDs and recent products
          if (!isInitializedRef.current) {
            lastProductIdsRef.current = new Set(currentProductIds);
            isInitializedRef.current = true;
            
            // Store the most recent 2 products as initial recent products
            const sortedProducts = [...currentProducts].sort((a, b) => {
              const dateA = new Date(a.createdAt || a.created_at || a.updatedAt || a.updated_at || 0);
              const dateB = new Date(b.createdAt || b.created_at || b.updatedAt || b.updated_at || 0);
              return dateB - dateA;
            });
            
            const initialRecent = sortedProducts.slice(0, 2).map(product => ({
              id: product._id || product.id,
              name: product.name || 'Unknown Product',
              image: product.image || product.images?.[0] || '',
              price: product.price || 0,
              unit: product.unit || 'kg',
              timestamp: product.createdAt || product.created_at || product.updatedAt || product.updated_at || new Date().toISOString(),
              read: false
            }));
            
            // Only update if we have products
            if (initialRecent.length > 0) {
              setRecentProducts(initialRecent);
              const unread = initialRecent.filter(p => !p.read).length;
              setUnreadCount(unread);
              try {
                localStorage.setItem('lastProductIds', JSON.stringify(Array.from(currentProductIds)));
                localStorage.setItem('recentProducts', JSON.stringify(initialRecent));
                console.log('Initialized with', initialRecent.length, 'products,', unread, 'unread');
              } catch (e) {
                console.error('Error saving product data:', e);
              }
            }
            return;
          }
          
          // Find new products (products that weren't in the last check)
          const newProducts = [];
          currentProducts.forEach(product => {
            const productId = product._id || product.id;
            if (productId && !lastProductIdsRef.current.has(productId)) {
              newProducts.push({
                id: productId,
                name: product.name || 'Unknown Product',
                image: product.image || product.images?.[0] || '',
                price: product.price || 0,
                unit: product.unit || 'kg',
                timestamp: product.createdAt || product.created_at || product.updatedAt || product.updated_at || new Date().toISOString(),
                read: false
              });
            }
          });
          
          // If new products found, add them to recent products
          if (newProducts.length > 0) {
            console.log(`New products detected: ${newProducts.length} products added`);
            setRecentProducts(prev => {
              // Add new products at the beginning
              const updated = [...newProducts, ...prev];
              // Keep only the 2 most recent
              const final = updated.slice(0, 2);
              const unread = final.filter(p => !p.read).length;
              setUnreadCount(unread);
              return final;
            });
          } else {
            // If no new products, update the recent products list with the 2 most recent from all products
            const sortedProducts = [...currentProducts].sort((a, b) => {
              const dateA = new Date(a.createdAt || a.created_at || a.updatedAt || a.updated_at || 0);
              const dateB = new Date(b.createdAt || b.created_at || b.updatedAt || b.updated_at || 0);
              return dateB - dateA;
            });
            
            const latestProducts = sortedProducts.slice(0, 2).map(product => ({
              id: product._id || product.id,
              name: product.name || 'Unknown Product',
              image: product.image || product.images?.[0] || '',
              price: product.price || 0,
              unit: product.unit || 'kg',
              timestamp: product.createdAt || product.created_at || product.updatedAt || product.updated_at || new Date().toISOString(),
              read: false
            }));
            
            // Only update if we have different products or if current list is empty
            if (latestProducts.length > 0 && (recentProducts.length === 0 || 
                latestProducts[0].id !== recentProducts[0]?.id)) {
              setRecentProducts(latestProducts);
              const unread = latestProducts.filter(p => !p.read).length;
              setUnreadCount(unread);
            }
          }
          
          // Update the last known product IDs
          lastProductIdsRef.current = new Set(currentProductIds);
          try {
            localStorage.setItem('lastProductIds', JSON.stringify(Array.from(currentProductIds)));
          } catch (e) {
            console.error('Error saving product IDs:', e);
          }
        } else {
          console.log('No products found or invalid response:', response);
        }
      } catch (error) {
        console.error('Error checking new products:', error);
      }
    };

    // Initial check immediately
    checkNewProducts();
    
    // Check every 15 seconds for new products
    const interval = setInterval(checkNewProducts, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleProductClick = (product) => {
    // Mark as read
    setRecentProducts(prev =>
      prev.map(p =>
        p.id === product.id ? { ...p, read: true } : p
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Navigate to browse products
    if (onBrowseClick) {
      onBrowseClick();
    }
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setRecentProducts(prev =>
      prev.map(p => ({ ...p, read: true }))
    );
    setUnreadCount(0);
  };

  const displayProducts = recentProducts.slice(0, 2); // Show last 2 products

  // Professional Bell Icon SVG
  const BellIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="bell-svg-icon"
    >
      <path 
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M13.73 21a2 2 0 0 1-3.46 0" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="product-notifications" ref={notificationRef}>
      <button
        className={`notification-bell ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const newState = !isOpen;
          setIsOpen(newState);
          console.log('Bell clicked!', {
            isOpen: newState,
            recentProducts: recentProducts.length,
            unreadCount: unreadCount,
            products: recentProducts
          });
        }}
        aria-label="Recent Products"
        title="Recent Products"
        type="button"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <motion.span
            className="notification-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            key={unreadCount}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notification-header">
              <h3>Recent Products</h3>
              {unreadCount > 0 && (
                <button className="mark-all-read" onClick={markAllAsRead}>
                  Mark all read
                </button>
              )}
            </div>

            <div className="notification-list">
              {displayProducts.length === 0 ? (
                <div className="no-notifications">
                  <span className="smile-icon">😊</span>
                  <p>No recent products yet</p>
                  <p className="sub-text">We'll show you the latest products here!</p>
                </div>
              ) : (
                displayProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className={`notification-item product-item ${product.read ? 'read' : 'unread'}`}
                    onClick={() => handleProductClick(product)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="notification-content">
                      <div className="product-image-wrapper">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="product-image-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>
                          <span className="smile-icon">😊</span>
                        </div>
                      </div>
                      <div className="notification-text">
                        <p className="notification-message product-name">
                          {product.name}
                        </p>
                        <p className="product-price">
                          ₹{product.price?.toFixed(2) || '0.00'} / {product.unit || 'kg'}
                        </p>
                        <span className="notification-time">
                          {new Date(product.timestamp).toLocaleString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      {!product.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {displayProducts.length > 0 && (
              <div className="notification-footer">
                <button
                  className="browse-button"
                  onClick={() => {
                    if (onBrowseClick) {
                      onBrowseClick();
                    }
                    setIsOpen(false);
                  }}
                >
                  <span className="smile-icon">😊</span>
                  Browse All Products & Order Now!
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductNotifications;
