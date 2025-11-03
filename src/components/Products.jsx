import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiEye, FiFilter } from 'react-icons/fi';
import { productAPI } from '../services/productAPI';
import { categoryAPI } from '../services/categoryAPI';
import { cartAPI } from '../services/cartAPI';
import { STORAGE_KEYS } from '../services/authAPI';
import toast from 'react-hot-toast';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const BACKEND_BASE = 'http://localhost:50011';

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchProducts();
      setLoading(false);
    };
    fetchData();
    loadCartFromStorage();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getPublicProducts({ limit: 12 });
      if (response.success) {
        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
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
      setFilteredProducts(products.filter(p => p.category.name === category));
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

      if (token) {
        const res = await cartAPI.addToCart(token, product._id, 1);
        if (res.success) {
          toast.success('Added to cart');
        } else {
          toast.error(res.message || 'Failed to add to cart');
        }
        return;
      }

      const existing = [...cart];
      const idx = existing.findIndex(i => i._id === product._id);
      if (idx >= 0) {
        existing[idx].quantity = (existing[idx].quantity || 1) + 1;
      } else {
        existing.push({ ...product, quantity: 1 });
      }
      setCart(existing);
      saveCartToStorage(existing);
      toast.success('Added to cart');
    } catch (e) {
      toast.error('Failed to add to cart');
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
        </div>
        <div className="product-info">
          <span className="product-category">{product.category.name}</span>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
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
        </div>

        <motion.div className="products-grid" layout>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
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
