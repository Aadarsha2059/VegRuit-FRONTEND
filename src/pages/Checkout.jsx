import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { cartAPI } from '../services/cartAPI'
import { orderAPI } from '../services/orderAPI'
import { STORAGE_KEYS } from '../services/authAPI'
import khaltiLogo from '../assets/khalti.png'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      street: '',
      city: 'Kathmandu',
      state: 'Bagmati',
      postalCode: '',
      country: 'Nepal',
      landmark: '',
      instructions: ''
    },
    paymentMethod: 'cod',
    deliveryDate: '',
    deliveryTimeSlot: 'anytime',
    deliveryInstructions: '',
    notes: ''
  })
  const [processing, setProcessing] = useState(false)

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

  useEffect(() => {
    if (!token) {
      navigate('/buyer-login')
      return
    }
    loadCart()
    
    // Load preferred payment method from localStorage
    const preferredPaymentMethod = localStorage.getItem('preferredPaymentMethod')
    if (preferredPaymentMethod) {
      setOrderData(prev => ({
        ...prev,
        paymentMethod: preferredPaymentMethod
      }))
    }
  }, [token, navigate])

  const loadCart = async () => {
    try {
      const response = await cartAPI.getCart(token)
      if (response.success) {
        setCart(response.data.cart)
        if (response.data.cart.items.length === 0) {
          toast.error('Your cart is empty')
          navigate('/buyer-dashboard')
        }
      } else {
        toast.error(response.message)
        navigate('/buyer-dashboard')
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      toast.error('Failed to load cart')
      navigate('/buyer-dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1]
      setOrderData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [field]: value
        }
      }))
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!orderData.deliveryAddress.street.trim()) {
          toast.error('Please enter delivery address')
          return false
        }
        if (!orderData.deliveryAddress.city.trim()) {
          toast.error('Please enter city')
          return false
        }
        return true
      case 2:
        return true // Delivery options are optional
      case 3:
        return true // Payment method has default
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    
    if (!validateStep(1)) return

    setProcessing(true)
    try {
      // Fix: Remove empty deliveryDate to prevent validation error
      const orderDataToSend = { ...orderData };
      if (!orderData.deliveryDate) {
        delete orderDataToSend.deliveryDate;
      }
      
      console.log('Order data being sent:', orderDataToSend)
      const response = await orderAPI.createOrder(token, orderDataToSend)
      console.log('Order response:', response)
      
      if (response.success) {
        toast.success('Order placed successfully!')
        navigate('/order-details/' + response.data.order._id)
      } else {
        toast.error(response.message || 'Failed to place order')
        if (response.errors) {
          console.error('Validation errors:', response.errors)
          response.errors.forEach(error => {
            toast.error(`${error.field}: ${error.message}`)
          })
        }
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="checkout-loading">
        <motion.div 
          className="loading-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-spinner"></div>
          <p>Loading your checkout...</p>
        </motion.div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <motion.div 
          className="empty-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some fresh products to continue with checkout</p>
          <button onClick={() => navigate('/buyer-dashboard')} className="btn btn-primary">
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  const subtotal = cart.totalValue
  const deliveryFee = 50
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + deliveryFee + tax

  const steps = [
    { number: 1, title: 'Delivery Address', icon: '🏠' },
    { number: 2, title: 'Delivery Options', icon: '🚚' },
    { number: 3, title: 'Payment & Review', icon: '💳' }
  ]

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <motion.div 
          className="checkout-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button onClick={() => navigate('/buyer-dashboard')} className="back-btn">
            <span className="back-icon">←</span>
            Back to Cart
          </button>
          <div className="header-content">
            <h1 className="checkout-title">Secure Checkout</h1>
            <p className="checkout-subtitle">Complete your order in just a few steps</p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="progress-steps"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
            >
              <div className="step-indicator">
                <span className="step-icon">{step.icon}</span>
                <span className="step-number">{step.number}</span>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </motion.div>

        <div className="checkout-main">
          {/* Form Section */}
          <motion.div 
            className="checkout-form-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              {/* Step 1: Delivery Address */}
              {currentStep === 1 && (
                <motion.div 
                  className="form-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="step-header">
                    <h2>🏠 Delivery Address</h2>
                    <p>Where should we deliver your fresh produce?</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Street Address *</label>
                      <input
                        type="text"
                        name="deliveryAddress.street"
                        value={orderData.deliveryAddress.street}
                        onChange={handleInputChange}
                        placeholder="Enter your complete street address"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="deliveryAddress.city"
                        value={orderData.deliveryAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="deliveryAddress.state"
                        value={orderData.deliveryAddress.state}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="deliveryAddress.postalCode"
                        value={orderData.deliveryAddress.postalCode}
                        onChange={handleInputChange}
                        placeholder="44600"
                      />
                    </div>

                    <div className="form-group">
                      <label>Landmark</label>
                      <input
                        type="text"
                        name="deliveryAddress.landmark"
                        value={orderData.deliveryAddress.landmark}
                        onChange={handleInputChange}
                        placeholder="Near school, temple, etc."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Delivery Instructions</label>
                      <textarea
                        name="deliveryAddress.instructions"
                        value={orderData.deliveryAddress.instructions}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for our delivery team"
                        rows="3"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Delivery Options */}
              {currentStep === 2 && (
                <motion.div 
                  className="form-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="step-header">
                    <h2>🚚 Delivery Options</h2>
                    <p>Choose your preferred delivery time</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Preferred Delivery Date</label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={orderData.deliveryDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="form-group">
                      <label>Time Slot</label>
                      <select
                        name="deliveryTimeSlot"
                        value={orderData.deliveryTimeSlot}
                        onChange={handleInputChange}
                      >
                        <option value="anytime">Anytime (8AM - 8PM)</option>
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                        <option value="evening">Evening (5PM - 8PM)</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Additional Notes</label>
                      <textarea
                        name="notes"
                        value={orderData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special requests or dietary preferences"
                        rows="3"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment & Review */}
              {currentStep === 3 && (
                <motion.div 
                  className="form-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="step-header">
                    <h2>💳 Payment Method</h2>
                    <p>Choose how you'd like to pay (you can change your preferred method)</p>
                  </div>

                  <div className="payment-methods">
                    <label className={`payment-method ${orderData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={orderData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-content">
                        <div className="payment-icon">💵</div>
                        <div className="payment-details">
                          <h4>Cash on Delivery</h4>
                          <p>Pay when you receive your fresh produce</p>
                          <span className="payment-badge">Recommended</span>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-method ${orderData.paymentMethod === 'khalti' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="khalti"
                        checked={orderData.paymentMethod === 'khalti'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-content">
                        <div className="payment-logo">
                          <img src={khaltiLogo} alt="Khalti" style={{maxWidth: '80px', height: 'auto'}} />
                        </div>
                        <div className="payment-details">
                          <h4>Khalti Digital Wallet</h4>
                          <p>Pay securely with Khalti - Nepal's most popular digital wallet</p>
                          <span className="payment-badge active">Available</span>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-method ${orderData.paymentMethod === 'esewa' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="esewa"
                        checked={orderData.paymentMethod === 'esewa'}
                        onChange={handleInputChange}
                      />
                      <div className="payment-content">
                        <div className="payment-logo">
                          <img src="https://esewa.com.np/common/images/esewa-logo.png" alt="eSewa" style={{maxWidth: '80px', height: 'auto'}} />
                        </div>
                        <div className="payment-details">
                          <h4>eSewa Digital Wallet</h4>
                          <p>Pay with eSewa - Trusted digital payment solution in Nepal</p>
                          <span className="payment-badge active">Available</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="btn btn-outline">
                    ← Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep} className="btn btn-primary">
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary place-order-btn"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="btn-spinner"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        🛒 Place Order - Rs. {total}
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div 
            className="order-summary-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="summary-header">
              <h3>Order Summary</h3>
              <span className="items-count">{cart.items.length} items</span>
            </div>

            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.productId} className="summary-item">
                  <div className="item-image">
                    {item.productImage ? (
                      <img 
                        src={item.productImage} 
                        alt={item.productName}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="item-placeholder" style={{display: item.productImage ? 'none' : 'flex'}}>
                      🥬
                    </div>
                  </div>
                  <div className="item-details">
                    <h4>{item.productName}</h4>
                    <p>Rs. {item.price} × {item.quantity} {item.unit}</p>
                    <small className="seller-name">by {item.sellerName || 'Local Farmer'}</small>
                  </div>
                  <div className="item-total">
                    Rs. {item.total}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-calculations">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="calc-row">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="calc-row">
                <span>Tax (13%)</span>
                <span>Rs. {tax}</span>
              </div>
              <div className="calc-row total">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            <div className="summary-features">
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Free delivery on orders over Rs. 500</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🌱</span>
                <span>Fresh from local farms</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure checkout</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout