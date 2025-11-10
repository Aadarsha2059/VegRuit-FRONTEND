import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiInfo, FiChevronRight, FiStar, FiUsers, FiTruck, FiChevronLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import basketImage from '../assets/basket.png';
import '../styles/Hero.css';

// Use the local basket.png image
const heroVegetablesImage = basketImage;

const Hero = () => {
  // Image slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Hero images - using high-quality Unsplash images
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&h=800&fit=crop&q=80',
      alt: 'Fresh vegetables and fruits',
      title: 'Farm-Fresh Goodness',
      subtitle: 'Delivered to Your Doorstep'
    },
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=800&fit=crop&q=80',
      alt: 'Organic vegetables',
      title: 'Organic & Healthy',
      subtitle: 'Straight from Local Farms'
    },
    {
      url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=800&fit=crop&q=80',
      alt: 'Fresh fruits',
      title: 'Nature\'s Best',
      subtitle: 'Handpicked for You'
    },
    {
      url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=800&fit=crop&q=80',
      alt: 'Colorful produce',
      title: 'Vibrant & Fresh',
      subtitle: 'Quality You Can Trust'
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: 0.4,
      },
    },
  };

  const statsVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.6,
      },
    },
  };

  return (
    <motion.section
      className="hero"
      id="home"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Elements */}
      <div className="hero-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="hero-container">
        {/* Trust Indicators */}
        <motion.div className="trust-indicators" variants={itemVariants}>
          <div className="trust-item">
            <FiStar className="trust-icon" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="trust-item">
            <FiUsers className="trust-icon" />
            <span>10,000+ Happy Customers</span>
          </div>
          <div className="trust-item">
            <FiTruck className="trust-icon" />
            <span>Same Day Delivery</span>
          </div>
        </motion.div>

        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.div className="hero-badge" variants={itemVariants}>
              <span className="badge-text">🌟 Nepal's #1 Fresh Produce Marketplace</span>
            </motion.div>
            
            <motion.h1 className="hero-title" variants={itemVariants}>
              Farm-Fresh Goodness
              <br />
              <span className="highlight">Delivered to Your Doorstep</span>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Connect directly with local farmers in Nepal and enjoy the freshest fruits and vegetables. 
              Supporting sustainable agriculture while bringing nature's best to your table.
            </motion.p>

            <motion.div className="hero-highlights" variants={itemVariants}>
              <div className="highlight-item">
                <span className="highlight-icon">✅</span>
                <span>100% Organic & Fresh</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">✅</span>
                <span>Direct from Local Farmers</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">✅</span>
                <span>Same Day Delivery in Kathmandu</span>
              </div>
            </motion.div>
            
            <motion.div className="hero-buttons" variants={itemVariants}>
              <Link to="/explore">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiShoppingBag className="btn-icon" />
                  Start Shopping
                  <FiChevronRight className="btn-arrow" />
                </motion.button>
              </Link>
              
              <Link to="/about">
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiInfo className="btn-icon" />
                  Learn More
                </motion.button>
              </Link>
            </motion.div>

            <motion.div className="hero-stats" variants={statsVariants}>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Local Farmers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Product Varieties</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5</span>
                <span className="stat-label">Cities Served</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="hero-image" variants={imageVariants}>
            <div className="basket-image-container" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '500px',
              width: '100%'
            }}>
              <motion.img 
                src={heroVegetablesImage} 
                alt="Fresh vegetables and fruits"
                className="basket-main-image"
                style={{
                  width: '100%',
                  maxWidth: '550px',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '30px',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)'
                }}
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="basket-glow"></div>
              
              {/* Floating Elements */}
              <motion.div
                className="floating-badge organic-badge"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="badge-icon">🌱</span>
                <div className="badge-content">
                  <span className="badge-title">100%</span>
                  <span className="badge-subtitle">Organic</span>
                </div>
              </motion.div>

              <motion.div
                className="floating-badge fresh-badge"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <span className="badge-icon">⚡</span>
                <div className="badge-content">
                  <span className="badge-title">Fresh</span>
                  <span className="badge-subtitle">Daily</span>
                </div>
              </motion.div>

              <motion.div
                className="floating-badge delivery-badge"
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2,
                }}
              >
                <span className="badge-icon">🚚</span>
                <div className="badge-content">
                  <span className="badge-title">Fast</span>
                  <span className="badge-subtitle">Delivery</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div className="hero-features" variants={containerVariants}>
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">🌱</div>
            <h3>Sustainably Sourced</h3>
            <p>Supporting eco-friendly farming practices across Nepal</p>
          </motion.div>
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">🚚</div>
            <h3>Reliable Delivery</h3>
            <p>Fresh produce delivered within hours of harvest</p>
          </motion.div>
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">✨</div>
            <h3>Premium Quality</h3>
            <p>Hand-selected by farmers for maximum freshness</p>
          </motion.div>
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">💰</div>
            <h3>Fair Pricing</h3>
            <p>Direct trade ensures fair prices for farmers and customers</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
