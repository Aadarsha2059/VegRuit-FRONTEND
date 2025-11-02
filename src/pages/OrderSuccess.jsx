import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { orderNumber, orderId } = location.state || {}

  useEffect(() => {
    // If no order data, redirect to dashboard
    if (!orderNumber) {
      navigate('/buyer-dashboard')
    }
  }, [orderNumber, navigate])

  const handleViewOrder = () => {
    navigate('/buyer-dashboard', { state: { activeTab: 'orders' } })
  }

  const handleContinueShopping = () => {
    navigate('/buyer-dashboard', { state: { activeTab: 'products' } })
  }

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <motion.div
          className="success-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            ✅
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Order Placed Successfully!
          </motion.h1>
          
          <motion.p
            className="success-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Thank you for your order. Your fresh produce will be delivered soon!
          </motion.p>

          {orderNumber && (
            <motion.div
              className="order-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3>Order Details</h3>
              <div className="order-info">
                <div className="info-item">
                  <span className="label">Order Number:</span>
                  <span className="value">#{orderNumber}</span>
                </div>
                <div className="info-item">
                  <span className="label">Order Date:</span>
                  <span className="value">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">Cash on Delivery</span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className="value status-pending">Pending</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="next-steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <h3>What's Next?</h3>
            <div className="steps">
              <div className="step">
                <div className="step-icon">📦</div>
                <div className="step-content">
                  <h4>Order Confirmation</h4>
                  <p>We'll confirm your order and prepare it for delivery</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">🚚</div>
                <div className="step-content">
                  <h4>Delivery</h4>
                  <p>Your fresh produce will be delivered to your address</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">⭐</div>
                <div className="step-content">
                  <h4>Review</h4>
                  <p>Share your experience and rate the products</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="action-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <button 
              className="btn btn-primary"
              onClick={handleViewOrder}
            >
              View Order Details
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </motion.div>

          <motion.div
            className="contact-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <p>
              Need help? Contact us at{' '}
              <a href="tel:+977-9800000000">+977-9800000000</a> or{' '}
              <a href="mailto:support@tarkarishop.com">support@tarkarishop.com</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderSuccess