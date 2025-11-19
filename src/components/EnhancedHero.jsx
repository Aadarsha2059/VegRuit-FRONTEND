import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiInfo, FiChevronRight, FiStar, FiUsers, FiTruck, FiChevronLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../styles/EnhancedHero.css';

const API_BASE_URL = 'http://localhost:5001/api';

const EnhancedHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Stats state
  const [stats, setStats] = useState({
    farmers: 0,
    products: 0,
    customers: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Professional high-quality images of fresh produce
  const heroSlides = [
    {
      url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1920&h=1080&fit=crop&q=90',
      alt: 'Fresh organic vegetables and fruits',
      title: 'Farm-Fresh Goodness',
      subtitle: 'Delivered to Your Doorstep',
      cta: 'Shop Now'
    },
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop&q=90',
      alt: 'Organic vegetables basket',
      title: 'Organic & Healthy',
      subtitle: 'Straight from Local Farms',
      cta: 'Explore Products'
    },
    {
      url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop&q=90',
      alt: 'Fresh colorful fruits',
      title: 'Nature\'s Best',
      subtitle: 'Handpicked for You',
      cta: 'Browse Collection'
    },
    {
      url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&h=1080&fit=crop&q=90',
      alt: 'Vibrant produce market',
      title: 'Vibrant & Fresh',
      subtitle: 'Quality You Can Trust',
      cta: 'Start Shopping'
    }
  ];

  // Fetch stats from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stats/homepage`);
        if (response.ok) {
          const data = await response.json();
          setStats({
            farmers: data.totalSellers || 0,
            products: data.totalProducts || 0,
            customers: data.totalBuyers || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    // Initial fetch
    fetchStats();
    
    // Poll for updates every 30 seconds
    const statsInterval = setInterval(fetchStats, 30000);
    
    // Cleanup interval on unmount
    return () => clearInterval(statsInterval);
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="enhanced-hero" id="home">
      {/* Image Slider */}
      <div className="hero-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="slide"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
          >
            <div 
              className="slide-image"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].url})` }}
            >
              <div className="slide-overlay"></div>
            </div>
            
            <div className="slide-content">
              <motion.div
                className="slide-text"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.h1 
                  className="slide-title"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                <motion.p 
                  className="slide-subtitle"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/explore">
                    <button className="slide-cta">
                      <FiShoppingBag />
                      {heroSlides[currentSlide].cta}
                      <FiChevronRight />
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <button className="slider-control prev" onClick={prevSlide} aria-label="Previous slide">
          <FiChevronLeft />
        </button>
        <button className="slider-control next" onClick={nextSlide} aria-label="Next slide">
          <FiChevronRight />
        </button>

        {/* Slider Indicators */}
        <div className="slider-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <motion.div 
        className="trust-bar"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="trust-container">
          <div className="trust-item">
            <FiStar className="trust-icon" />
            <div className="trust-text">
              <span className="trust-value">4.9/5</span>
              <span className="trust-label">Rating</span>
            </div>
          </div>
          <div className="trust-item">
            <FiUsers className="trust-icon" />
            <div className="trust-text">
              <span className="trust-value">
                {statsLoading ? '...' : `${stats.customers}+`}
              </span>
              <span className="trust-label">Happy Customers</span>
            </div>
          </div>
          <div className="trust-item">
            <FiTruck className="trust-icon" />
            <div className="trust-text">
              <span className="trust-value">Same Day</span>
              <span className="trust-label">Delivery</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="hero-features-section">
        <div className="features-container">
          <motion.div 
            className="feature-card"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="feature-icon">🌱</div>
            <h3 className="feature-title">100% Organic</h3>
            <p className="feature-description">
              Certified organic produce from sustainable farms
            </p>
          </motion.div>

          <motion.div 
            className="feature-card"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Fast Delivery</h3>
            <p className="feature-description">
              Fresh produce delivered within hours of harvest
            </p>
          </motion.div>

          <motion.div 
            className="feature-card"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">Premium Quality</h3>
            <p className="feature-description">
              Hand-selected by farmers for maximum freshness
            </p>
          </motion.div>

          <motion.div 
            className="feature-card"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <div className="feature-icon">💰</div>
            <h3 className="feature-title">Fair Pricing</h3>
            <p className="feature-description">
              Direct trade ensures fair prices for all
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        className="stats-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="stats-container">
          <motion.div 
            className="stat-item"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="stat-number">
              {statsLoading ? '...' : `${stats.farmers}+`}
            </span>
            <span className="stat-label">Local Farmers</span>
          </motion.div>
          <motion.div 
            className="stat-item"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <span className="stat-number">
              {statsLoading ? '...' : `${stats.products}+`}
            </span>
            <span className="stat-label">Product Varieties</span>
          </motion.div>
          <motion.div 
            className="stat-item"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <span className="stat-number">
              {statsLoading ? '...' : `${stats.customers}+`}
            </span>
            <span className="stat-label">Happy Customers</span>
          </motion.div>
          <motion.div 
            className="stat-item"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <span className="stat-number">24/7</span>
            <span className="stat-label">Customer Support</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default EnhancedHero;
