import React, { useState, useEffect } from 'react';
import { getProducts, getFeaturedProducts } from '../services/productAPI';
import toast from 'react-hot-toast';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
    loadCartFromStorage();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ limit: 6, isActive: true });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await getFeaturedProducts(3);
      setFeaturedProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    let newCart;

    if (existingItem) {
      // Check if adding one more would exceed stock
      if (existingItem.quantity >= product.stock) {
        toast.error(`Only ${product.stock} ${product.unit} available in stock`);
        return;
      }
      
      newCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      toast.success(`Added another ${product.name} to cart`);
    } else {
      if (product.stock === 0) {
        toast.error('Product is out of stock');
        return;
      }
      
      newCart = [...cart, { 
        ...product, 
        quantity: 1,
        addedAt: new Date().toISOString()
      }];
      toast.success(`${product.name} added to cart`);
    }

    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="star">
        {index < fullStars ? '★' : index === fullStars && hasHalfStar ? '☆' : '☆'}
      </span>
    ));
  };

  const ProductCard = ({ product, isFeatured = false }) => {
    const primaryImage = product.images && product.images.length > 0 
      ? `http://localhost:5000${product.images[0]}` 
      : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop';

    const isInCart = cart.some(item => item._id === product._id);
    const cartItem = cart.find(item => item._id === product._id);
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
      <div className={`product-card ${isFeatured ? 'featured' : ''}`}>
        <div className="product-image">
          <img src={primaryImage} alt={product.name} />
          <div className="product-overlay">
            <button className="quick-view-btn">Quick View</button>
          </div>
          
          {isFeatured && (
            <div className="featured-badge">
              <span>⭐ Featured</span>
            </div>
          )}
          
          {product.isOrganic && (
            <div className="organic-badge">
              <span>🌱 Organic</span>
            </div>
          )}
          
          {isOutOfStock && (
            <div className="stock-badge out-of-stock">
              <span>Out of Stock</span>
            </div>
          )}
          
          {isLowStock && (
            <div className="stock-badge low-stock">
              <span>Only {product.stock} left</span>
            </div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-category">{product.category.name}</div>
          <h3 className="product-name">{product.name}</h3>
          
          {product.farmLocation && (
            <div className="farm-location">📍 {product.farmLocation}</div>
          )}
          
          <div className="product-rating">
            <div className="stars">
              {renderStars(product.averageRating || 4.5)}
            </div>
            <span className="rating-text">({product.totalReviews || 0} reviews)</span>
          </div>
          
          <div className="product-pricing">
            <div className="current-price">₹{product.price}/{product.unit}</div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="original-price">₹{product.originalPrice}</div>
            )}
          </div>
          
          <div className="product-actions">
            <button 
              className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''} ${isInCart ? 'in-cart' : ''}`}
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 
               isInCart ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="products" id="products">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading fresh products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products" id="products">
      <div className="container">
        <div className="section-header">
          <h2>Our Fresh Products</h2>
          <p>Handpicked fresh fruits and vegetables from local farmers</p>
        </div>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="featured-section">
            <h3 className="featured-title">⭐ Featured Products</h3>
            <div className="featured-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} isFeatured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Products Section */}
        <div className="products-section">
          <h3 className="section-title">All Products</h3>
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">🥬</div>
              <h3>No Products Available</h3>
              <p>Check back soon for fresh produce from our farmers!</p>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="cart-info">
              <span className="cart-count">🛒 {cart.length} items in cart</span>
              <span className="cart-total">
                Total: ₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
            <button className="view-cart-btn">View Cart</button>
          </div>
        )}

        <div className="products-cta">
          <h3>Want to See More?</h3>
          <p>Explore our complete catalog of fresh produce</p>
          <button className="btn btn-primary">View All Products</button>
        </div>
      </div>
    </section>
  );
};

export default Products;
