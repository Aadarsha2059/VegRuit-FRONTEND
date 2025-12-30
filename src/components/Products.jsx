import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiEye, FiFilter } from 'react-icons/fi';
import { productAPI } from '../services/productAPI';
import { categoryAPI } from '../services/categoryAPI';
import { cartAPI } from '../services/cartAPI';
import { favoritesAPI } from '../services/favoritesAPI'; // Fixed import name
import { STORAGE_KEYS } from '../services/authAPI';
import toast from 'react-hot-toast';
import '../styles/Products.css';

const Products = ({ onAuthClick }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set()); // Track favorites
  const BACKEND_BASE = 'http://localhost:5001';

  // Define extra categories that will always show "coming soon"
  const extraCategories = [
    { _id: 'extra-1', name: 'Exotic Fruits' },
    { _id: 'extra-2', name: 'Rare Vegetables' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchProducts();
      await fetchFavorites(); // Fetch user's favorites
      setLoading(false);
    };
    
    // Initial fetch
    fetchData();
    loadCartFromStorage();
    
    // Poll for updates every 45 seconds
    const productsInterval = setInterval(async () => {
      await fetchProducts();
      await fetchCategories();
    }, 45000);
    
    // Cleanup interval on unmount
    return () => clearInterval(productsInterval);
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch all products from sellers - get total count first, then fetch all
      const initialResponse = await productAPI.getPublicProducts({ limit: 1, page: 1 });
      let allProducts = [];
      
      if (initialResponse.success && initialResponse.data.pagination) {
        const totalProducts = initialResponse.data.pagination.total;
        console.log(`[Products] Total products available: ${totalProducts}`);
        
        if (totalProducts > 0) {
          // Fetch all products in one request
          const response = await productAPI.getPublicProducts({ limit: totalProducts, page: 1 });
          if (response.success) {
            allProducts = response.data.products || [];
            console.log(`[Products] Loaded ${allProducts.length} products from sellers`);
          }
        }
      } else {
        // Fallback: fetch with high limit
        const response = await productAPI.getPublicProducts({ limit: 1000, page: 1 });
        if (response.success) {
          allProducts = response.data.products || [];
          console.log(`[Products] Loaded ${allProducts.length} products (fallback method)`);
        }
      }
      
      setProducts(allProducts);
      
      // If active category is 'all', update filtered products as well
      if (activeCategory === 'all') {
        setFilteredProducts(allProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return;

      const response = await favoritesAPI.getUserFavorites(token);
      if (response.success) {
        const favoriteIds = new Set(response.data.favorites.map(fav => fav.productId));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getPublicCategories();
      if (response.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      // Check if it's one of our extra categories
      const isExtraCategory = extraCategories.some(cat => cat.name === category);
      
      if (isExtraCategory) {
        // For extra categories, show no products to trigger the coming soon message
        setFilteredProducts([]);
      } else {
        // For regular categories, filter normally
        const filtered = products.filter(p => p.category.name === category);
        setFilteredProducts(filtered);
      }
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

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (!token) {
        // No token means user is not logged in - show auth modal
        if (onAuthClick) {
          onAuthClick();
        } else {
          toast.error('Please login first to add items to cart');
        }
        return;
      }

      const res = await cartAPI.addToCart(token, product._id, 1);
      if (res.success) {
        toast.success('Added to cart');
      } else {
        toast.error(res.message || 'Failed to add to cart');
      }
      return;
    } catch (e) {
      toast.error('Failed to add to cart');
    }
  };

  const toggleFavorite = async (product) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        if (onAuthClick) {
          onAuthClick();
        } else {
          toast.error('Please login first to add to favorites');
        }
        return;
      }

      let response;
      if (favorites.has(product._id)) {
        // Remove from favorites
        response = await favoritesAPI.removeFromFavorites(token, product._id);
        if (response.success) {
          setFavorites(prev => {
            const newSet = new Set(prev);
            newSet.delete(product._id);
            return newSet;
          });
          toast.success('Removed from favorites');
        }
      } else {
        // Add to favorites
        response = await favoritesAPI.addToFavorites(token, product._id);
        if (response.success) {
          setFavorites(prev => new Set([...prev, product._id]));
          toast.success('Added to favorites');
        }
      }

      if (!response.success) {
        toast.error(response.message || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const renderStars = (rating) => {
    const r = Math.round(rating || 0);
    return '★★★★★'.split('').map((s, i) => (
      <span key={i} style={{ color: i < r ? '#f59e0b' : '#d1d5db' }}>★</span>
    ));
  };

  const ProductCard = ({ product }) => {
    const primaryImage = product.images && product.images.length > 0
      ? `${BACKEND_BASE}${product.images[0]}`
      : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop';

    // Calculate original price (actual price + 20)
    const originalPrice = product.price + 20;

    return (
      <motion.div
        className="product-card"
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="product-image">
          <img src={primaryImage} alt={product.name} />
          <div className="product-overlay">
            <button className="quick-view-btn"><FiEye /> Quick View</button>
          </div>
          {product.isOrganic && <div className="organic-badge">🌱</div>}
          <button 
            className={`favorite-btn ${favorites.has(product._id) ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product);
            }}
            aria-label={favorites.has(product._id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorites.has(product._id) ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="product-info">
          <span className="product-category">{product.category.name}</span>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-description">{product.description}</div>
          <div className="product-price-container">
            <span className="original-price">₹{originalPrice}</span>
            <span className="current-price">₹{product.price}</span>
            <span className="unit">/ {product.unit}</span>
          </div>
          <div className="product-rating" aria-label={`Rating ${product.averageRating || 0} out of 5`}>
            {renderStars(product.averageRating)}
            <span className="rating-count">({product.totalReviews || 0})</span>
          </div>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </motion.div>
    );
  };

  const SkeletonCard = () => (
    <div className="product-card skeleton">
      <div className="product-image"></div>
      <div className="product-info">
        <div className="skeleton-line" style={{ width: '40%' }}></div>
        <div className="skeleton-line" style={{ width: '80%' }}></div>
        <div className="skeleton-line" style={{ width: '60%' }}></div>
        <div className="skeleton-line" style={{ width: '70%' }}></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  return (
    <section className="products" id="products">
      <div className="container">
        <div className="section-header">
          <h2>Discover Our Products</h2>
          <p>From farm-fresh vegetables to juicy fruits, find everything you need.</p>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleFilter('all')}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleFilter(cat.name)}
            >
              {cat.name}
            </button>
          ))}
          {/* Add the extra categories */}
          {extraCategories.map(cat => (
            <button
              key={cat._id}
              className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleFilter(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <motion.div className="products-grid" layout>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredProducts.length > 0
              ? filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              : activeCategory === 'all' && products.length === 0
                ? (
                  <div className="no-products-message">
                    <h3>Products Coming Soon!</h3>
                    <p>We're working hard to bring you amazing fresh fruits products. Stay tuned!</p>
                  </div>
                )
                : activeCategory !== 'all'
                  ? (
                    <div className="no-products-message">
                      <h3>Products Coming Soon!</h3>
                      <p>We're working hard to bring you amazing {activeCategory.toLowerCase()} products. Stay tuned!</p>
                    </div>
                  )
                  : Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          }
        </motion.div>

        <div className="products-cta">
          <h3>Looking for more?</h3>
          <p>Explore our full range of products and find your favorites.</p>
          <button className="btn btn-primary">View All Products</button>
        </div>
      </div>
    </section>
  );
};

export default Products;