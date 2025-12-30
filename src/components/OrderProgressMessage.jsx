import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OrderProgressMessage.css';

const OrderProgressMessage = ({ step, show }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 6 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, step]); // Reset when step changes

  const getRemainingSteps = () => {
    switch (step) {
      case 'added':
        return 3; // cart review, checkout step 1, checkout step 2, checkout step 3
      case 'cart':
        return 2; // checkout step 1, checkout step 2, checkout step 3
      case 'checkout-1':
        return 2; // checkout step 2, checkout step 3
      case 'checkout-2':
        return 1; // checkout step 3
      case 'checkout-3':
        return 0; // place order
      default:
        return 3;
    }
  };

  const getMessage = () => {
    const remainingSteps = getRemainingSteps();
    
    switch (step) {
      case 'added':
        return {
          text: `You are ${remainingSteps} steps away!`,
          subtext: 'Great! Item added to cart. Review and checkout',
          emoji: '🛍️',
          color: '#4caf50'
        };
      case 'cart':
        return {
          text: `You are ${remainingSteps} steps away!`,
          subtext: 'Review your cart and proceed to checkout',
          emoji: '🛒',
          color: '#4caf50'
        };
      case 'checkout-1':
        return {
          text: `You are ${remainingSteps} steps away!`,
          subtext: 'Just fill in your delivery address',
          emoji: '🏠',
          color: '#4caf50'
        };
      case 'checkout-2':
        return {
          text: `You are ${remainingSteps} step away!`,
          subtext: 'Choose your delivery options',
          emoji: '🚚',
          color: '#4caf50'
        };
      case 'checkout-3':
        return {
          text: 'You reached!',
          subtext: 'Select payment method and complete your order',
          emoji: '💳',
          color: '#4caf50'
        };
      default:
        return {
          text: `You are ${remainingSteps} steps away!`,
          subtext: 'Add items to cart to get started',
          emoji: '🛍️',
          color: '#4caf50'
        };
    }
  };

  const message = getMessage();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="order-progress-message"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 25,
            duration: 0.5
          }}
        >
          <div className="progress-message-content">
            <motion.div
              className="progress-emoji"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              {message.emoji}
            </motion.div>
            <div className="progress-text">
              <h3 style={{ color: message.color }}>{message.text}</h3>
              <p>{message.subtext}</p>
            </div>
            <button 
              className="close-progress-btn"
              onClick={() => setIsVisible(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <motion.div
            className="progress-progress-bar"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 6, ease: 'linear' }}
            style={{ backgroundColor: message.color }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderProgressMessage;

