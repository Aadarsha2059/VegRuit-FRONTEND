import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { cartAPI } from '../services/cartAPI'
import { orderAPI } from '../services/orderAPI'
import { STORAGE_KEYS } from '../services/authAPI'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
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

  const validateForm = () => {
    if (!orderData.deliveryAddress.street.trim()) {
      toast.error('Please enter delivery address')
      return false
    }
    if (!orderData.deliveryAddress.city.trim()) {
      toast.error('Please enter city')
      return false
    }
    return true
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setProcessing(true)
    try {
      const response = await orderAPI.createOrder(token, orderData)
      if (response.success) {
        toast.success('Order placed successfully!')
        navigate('/order-details/' + response.data.order._id)
      } else {
        toast.error(response.message)
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
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/buyer-dashboard')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    )
  }

  const subtotal = cart.totalValue
  const deliveryFee = 50
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + deliveryFee + tax

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <button onClick={() => navigate('/buyer-dashboard')} className="back-btn">
            ← Back to Cart
          </button>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handlePlaceOrder}>
              {/* Delivery Address */}
              <div className="form-section">
                <h3>Delivery Address</h3>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="deliveryAddress.street"
                    value={orderData.deliveryAddress.street}
                    onChange={handleInputChange}
                    placeholder="Enter your street address"
                    required
                  />
                </div>
                <div className="form-row">
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
                </div>
                <div className="form-group">
                  <label>Landmark (Optional)</label>
                  <input
                    type="text"
                    name="deliveryAddress.landmark"
                    value={orderData.deliveryAddress.landmark}
                    onChange={handleInputChange}
                    placeholder="Near school, temple, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Instructions (Optional)</label>
                  <textarea
                    name="deliveryAddress.instructions"
                    value={orderData.deliveryAddress.instructions}
                    onChange={handleInputChange}
                    placeholder="Special instructions for delivery"
                    rows="3"
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div className="form-section">
                <h3>Delivery Options</h3>
                <div className="form-row">
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
                      <option value="anytime">Anytime</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={orderData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special requests or notes"
                    rows="3"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={orderData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-info">
                      <h4>Cash on Delivery</h4>
                      <p>Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={orderData.paymentMethod === 'khalti'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-info">
                      <h4>Khalti</h4>
                      <p>Digital wallet payment</p>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={orderData.paymentMethod === 'esewa'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-info">
                      <h4>eSewa</h4>
                      <p>Online payment gateway</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary place-order-btn"
                  disabled={processing}
                >
                  {processing ? 'Placing Order...' : `Place Order - Rs. ${total}`}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item.productId} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.productImage || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop'} 
                      alt={item.productName} 
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.productName}</h4>
                    <p>Rs. {item.price}/{item.unit}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-total">
                    Rs. {item.total}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="total-row">
                <span>Tax (13%):</span>
                <span>Rs. {tax}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>Rs. {total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout