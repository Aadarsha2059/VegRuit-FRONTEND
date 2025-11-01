import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiInfo, FiChevronRight } from 'react-icons/fi';
import basketImage from '../assets/basket.png';
import '../styles/Hero.css';

const Hero = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: 0.4,
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
      <div className="hero-container">
        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1 className="hero-title" variants={itemVariants}>
              Freshness Delivered,
              <br />
              <span className="highlight">From Farm to Your Fork</span>
            </motion.h1>
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Experience the taste of locally sourced, farm-fresh fruits and vegetables, brought to you with care from the fields of Kathmandu.
            </motion.p>
            <motion.div className="hero-buttons" variants={itemVariants}>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now <FiShoppingBag className="btn-icon" />
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More <FiInfo className="btn-icon" />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div className="hero-image" variants={imageVariants}>
            <img src={basketImage} alt="Fresh fruits and vegetables basket" />
            <motion.div
              className="floating-badge"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span>100%</span>
              <span>Organic</span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="hero-features" variants={containerVariants}>
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">🌱</div>
            <h3>Sustainably Sourced</h3>
            <p>From local Kathmandu farms</p>
          </motion.div>
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">🚚</div>
            <h3>Reliable Delivery</h3>
            <p>Fast, fresh, and on time</p>
          </motion.div>
          <motion.div className="feature" variants={itemVariants}>
            <div className="feature-icon">✨</div>
            <h3>Unbeatable Quality</h3>
            <p>Hand-selected for freshness</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
