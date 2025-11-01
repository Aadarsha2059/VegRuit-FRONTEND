import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/Explore.css';

const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    {
      id: 'all',
      name: 'All Products',
      icon: '🛒',
      description: 'Browse our entire collection of fresh produce'
    },
    {
      id: 'fruits',
      name: 'Fresh Fruits',
      icon: '🍎',
      description: 'Sweet and nutritious fruits from local orchards'
    },
    {
      id: 'vegetables',
      name: 'Fresh Vegetables',
      icon: '🥬',
      description: 'Organic vegetables from local farmers'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Specials',
      icon: '🌟',
      description: 'Limited time seasonal produce'
    },
    {
      id: 'organic',
      name: 'Organic Only',
      icon: '🌱',
      description: 'Certified organic products only'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Red Apples',
      category: 'fruits',
      price: 'Rs. 180/kg',
      originalPrice: 'Rs. 200/kg',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
      description: 'Sweet and crisp red apples from local orchards',
      rating: 4.8,
      reviews: 124,
      organic: true,
      farm: 'Himalayan Orchards',
      farmer: 'Ram Prasad'
    },
    {
      id: 2,
      name: 'Organic Tomatoes',
      category: 'vegetables',
      price: 'Rs. 90/kg',
      originalPrice: 'Rs. 100/kg',
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=300&fit=crop',
      description: 'Ripe and juicy organic tomatoes',
      rating: 4.6,
      reviews: 89,
      organic: true,
      farm: 'Green Valley Farms',
      farmer: 'Sita Kumari'
    },
    {
      id: 3,
      name: 'Fresh Mangoes',
      category: 'fruits',
      price: 'Rs. 200/kg',
      originalPrice: 'Rs. 220/kg',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&h=300&fit=crop',
      description: 'Sweet and aromatic seasonal mangoes',
      rating: 4.9,
      reviews: 203,
      organic: false,
      farm: 'Tropical Gardens',
      farmer: 'Krishna Thapa'
    },
    {
      id: 4,
      name: 'Cauliflower',
      category: 'vegetables',
      price: 'Rs. 80/kg',
      originalPrice: 'Rs. 90/kg',
      image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&h=300&fit=crop',
      description: 'Fresh organic cauliflower',
      rating: 4.5,
      reviews: 67,
      organic: true,
      farm: 'Organic Valley',
      farmer: 'Maya Gurung'
    },
    {
      id: 5,
      name: 'Strawberries',
      category: 'seasonal',
      price: 'Rs. 300/kg',
      originalPrice: 'Rs. 350/kg',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop',
      description: 'Sweet seasonal strawberries',
      rating: 4.7,
      reviews: 156,
      organic: true,
      farm: 'Berry Fields',
      farmer: 'Anil Shah'
    },
    {
      id: 6,
      name: 'Green Peas',
      category: 'seasonal',
      price: 'Rs. 100/kg',
      originalPrice: 'Rs. 120/kg',
      image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=300&h=300&fit=crop',
      description: 'Fresh green peas',
      rating: 4.4,
      reviews: 92,
      organic: false,
      farm: 'Spring Gardens',
      farmer: 'Pooja Rai'
    },
    {
      id: 7,
      name: 'Bananas',
      category: 'fruits',
      price: 'Rs. 80/kg',
      originalPrice: 'Rs. 90/kg',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
      description: 'Fresh and energy-rich bananas',
      rating: 4.3,
      reviews: 78,
      organic: false,
      farm: 'Tropical Orchards',
      farmer: 'Rajesh K.C.'
    },
    {
      id: 8,
      name: 'Spinach',
      category: 'vegetables',
      price: 'Rs. 50/kg',
      originalPrice: 'Rs. 60/kg',
      image: 'https://images.unsplash.com/photo-1576045057992-9a503194f2ff?w=300&h=300&fit=crop',
      description: 'Nutritious fresh spinach',
      rating: 4.6,
      reviews: 112,
      organic: true,
      farm: 'Green Leaf Farms',
      farmer: 'Laxmi Poudel'
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="explore-page">
      {/* Hero Section */}
      <section className="explore-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <BackButton />
            <h1 className="hero-title">Explore Fresh Produce</h1>
            <p className="hero-subtitle">
              Discover the finest selection of fruits and vegetables from local farmers in Nepal
            </p>
            <div className="hero-cta">
              <Link to="/auth" className="hero-button primary">
                Start Shopping
              </Link>
              <Link to="/about" className="hero-button secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <div className="categories-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {activeCategory === 'all' 
                ? 'All Fresh Products' 
                : categories.find(cat => cat.id === activeCategory)?.name}
            </h2>
            <p className="section-subtitle">
              {activeCategory === 'all' 
                ? 'Browse our entire collection of fresh produce' 
                : categories.find(cat => cat.id === activeCategory)?.description}
            </p>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.organic && (
                  <div className="organic-badge">
                    <span>🌱 Organic</span>
                  </div>
                )}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-meta">
                    <div className="farmer-info">
                      <span className="farmer-name">By {product.farmer}</span>
                      <span className="farm-name">{product.farm}</span>
                    </div>
                    
                    <div className="product-rating">
                      <span className="rating-stars">⭐ {product.rating}</span>
                      <span className="rating-count">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="product-pricing">
                    <span className="current-price">{product.price}</span>
                    {product.originalPrice !== product.price && (
                      <span className="original-price">{product.originalPrice}</span>
                    )}
                  </div>
                  
                  <div className="product-actions">
                    <button className="add-to-cart-btn">🛒 Add to Cart</button>
                    <button className="wishlist-btn">❤️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="explore-features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose VegRuit</h2>
            <p className="section-subtitle">Experience the difference with our premium service</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Same day delivery within Kathmandu Valley</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>100% Organic</h3>
              <p>All produce is certified organic and fresh</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🌾</div>
              <h3>Local Farmers</h3>
              <p>Direct from local farmers to your table</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive prices for premium quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="explore-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>
              Join thousands of satisfied customers who trust VegRuit for their daily fresh produce needs
            </p>
            <div className="cta-buttons">
              <Link to="/auth" className="cta-button primary">
                Start Shopping Now
              </Link>
              <Link to="/about" className="cta-button secondary">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;