import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import khaltiLogo from '../../assets/khalti.png'
import './PaymentsTab.css'

const PaymentsTab = ({ cart, onCheckout }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod')
  const [processing, setProcessing] = useState(false)

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay with cash when your order is delivered',
      icon: '💵',
      logo: null,
      available: true,
      fees: 'Free'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      description: 'Pay securely with Khalti Digital Wallet',
      icon: '💜',
      logo: khaltiLogo,
      available: true,
      fees: '0%'
    },
    {
      id: 'esewa',
      name: 'eSewa',
      description: 'Pay with eSewa Digital Wallet',
      icon: '💚',
      logo: 'https://esewa.com.np/common/images/esewa-logo.png',
      available: true,
      fees: '0%'
    }
  ]

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId)
  }

  const handleProceedToPayment = async () => {
    if (!cart || cart.totalItems === 0) {
      return
    }

    setProcessing(true)

    try {
      if (selectedPaymentMethod === 'khalti') {
        // Khalti Integration
        initiateKhaltiPayment()
      } else if (selectedPaymentMethod === 'esewa') {
        // eSewa Integration
        initiateEsewaPayment()
      } else if (selectedPaymentMethod === 'cod') {
        // Cash on Delivery
        toast.success('✅ Order confirmed! You will pay cash on delivery.')
        if (onCheckout) {
          onCheckout({ 
            paymentMethod: 'cod',
            transactionId: `COD-${Date.now()}`,
            amount: cart.totalPrice || 0
          })
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const initiateKhaltiPayment = () => {
    // Check if Khalti is loaded
    if (!window.KhaltiCheckout) {
      toast.error('Khalti payment gateway is not loaded. Please refresh the page.')
      setProcessing(false)
      return
    }

    // Khalti Public Test Key
    const config = {
      publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
      productIdentity: cart._id || `order_${Date.now()}`,
      productName: "TarkariShop Fresh Produce Order",
      productUrl: window.location.origin,
      eventHandler: {
        onSuccess(payload) {
          console.log('Khalti Payment Success:', payload)
          toast.success('🎉 Payment successful! Processing your order...')
          
          // Call checkout with payment data
          if (onCheckout) {
            onCheckout({ 
              paymentMethod: 'khalti',
              transactionId: payload.idx,
              token: payload.token,
              amount: payload.amount,
              payload 
            })
          }
          setProcessing(false)
        },
        onError(error) {
          console.error('Khalti Payment Error:', error)
          toast.error('❌ Payment failed. Please try again.')
          setProcessing(false)
        },
        onClose() {
          console.log('Khalti widget closed')
          toast.info('Payment cancelled')
          setProcessing(false)
        }
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"]
    }

    try {
      const checkout = new window.KhaltiCheckout(config)
      checkout.show({ amount: Math.round((cart.totalPrice || 0) * 100) }) // Amount in paisa (1 Rs = 100 paisa)
    } catch (error) {
      console.error('Khalti initialization error:', error)
      toast.error('Failed to initialize Khalti payment')
      setProcessing(false)
    }
  }

  const initiateEsewaPayment = () => {
    try {
      toast.info('🔄 Redirecting to eSewa payment gateway...')
      
      // eSewa Integration - UAT (Test) Environment
      const path = "https://uat.esewa.com.np/epay/main"
      const params = {
        amt: (cart.totalPrice || 0).toFixed(2),
        psc: 0, // Service charge
        pdc: 0, // Delivery charge
        txAmt: 0, // Tax amount
        tAmt: (cart.totalPrice || 0).toFixed(2), // Total amount
        pid: `TARKARI-${Date.now()}`, // Product ID
        scd: "EPAYTEST", // Merchant code (Test)
        su: `${window.location.origin}/payment-success?method=esewa`, // Success URL
        fu: `${window.location.origin}/payment-failure?method=esewa`  // Failure URL
      }

      // Create form dynamically
      const form = document.createElement('form')
      form.setAttribute('method', 'POST')
      form.setAttribute('action', path)
      form.setAttribute('target', '_blank') // Open in new tab

      // Add form fields
      Object.keys(params).forEach(key => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('value', params[key])
        form.appendChild(input)
      })

      // Submit form
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
      
      // Reset processing state after a delay
      setTimeout(() => {
        setProcessing(false)
      }, 2000)
      
    } catch (error) {
      console.error('eSewa payment error:', error)
      toast.error('Failed to initialize eSewa payment')
      setProcessing(false)
    }
  }

  return (
    <div className="payments-tab">
      <div className="payments-header">
        <h2>💳 Payment Methods</h2>
        <p>Choose your preferred payment method for your orders</p>
      </div>

      {/* Always show payment methods */}
      <div className="payment-methods">
        <h3>Available Payment Options</h3>
        <div className="payment-methods-grid">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method-card ${selectedPaymentMethod === method.id ? 'selected' : ''} ${!method.available ? 'disabled' : ''}`}
              onClick={() => method.available && handlePaymentMethodSelect(method.id)}
            >
              <div className="payment-method-header">
                <div className="payment-method-icon">{method.icon}</div>
                {selectedPaymentMethod === method.id && (
                  <div className="selected-badge">✓</div>
                )}
              </div>

              {method.logo ? (
                <div className="payment-method-logo">
                  <img src={method.logo} alt={method.name} />
                </div>
              ) : (
                <div className="payment-method-name-large">{method.name}</div>
              )}

              <div className="payment-method-info">
                <h4>{method.name}</h4>
                <p>{method.description}</p>
                <div className="payment-method-fees">
                  Transaction Fee: <strong>{method.fees}</strong>
                </div>
              </div>

              {!method.available && (
                <div className="unavailable-badge">Coming Soon</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Details */}
      <div className="payment-info-section">
        <h3>💡 Payment Information</h3>
        <div className="payment-info-grid">
          <div className="info-card">
            <div className="info-icon">💵</div>
            <h4>Cash on Delivery</h4>
            <p>Pay with cash when your order arrives. No online payment required.</p>
            <ul className="features-list">
              <li>✓ No advance payment</li>
              <li>✓ Inspect before paying</li>
              <li>✓ Most convenient</li>
            </ul>
          </div>
          <div className="info-card">
            <div className="info-icon">💜</div>
            <h4>Khalti</h4>
            <p>Nepal's most popular digital wallet. Pay instantly using your Khalti balance, bank account, or cards.</p>
            <ul className="features-list">
              <li>✓ Instant payment confirmation</li>
              <li>✓ Multiple payment options</li>
              <li>✓ Secure transactions</li>
            </ul>
          </div>
          <div className="info-card">
            <div className="info-icon">💚</div>
            <h4>eSewa</h4>
            <p>Trusted digital payment solution in Nepal. Quick and secure payments from your eSewa wallet.</p>
            <ul className="features-list">
              <li>✓ Fast & reliable</li>
              <li>✓ Wide acceptance</li>
              <li>✓ Easy refunds</li>
            </ul>
          </div>
        </div>
      </div>

      {cart && cart.totalItems > 0 ? (
        <>
          <div className="checkout-section">
            <div className="order-summary">
              <h3>📋 Order Summary</h3>
              <div className="summary-row">
                <span>Items ({cart.totalItems || 0})</span>
                <span>Rs. {(cart.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>Rs. {(cart.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={handleProceedToPayment}
                disabled={processing || !selectedPaymentMethod}
              >
                {processing ? (
                  <>⏳ Processing...</>
                ) : (
                  <>🔒 Proceed to Payment (Rs. {(cart.totalPrice || 0).toFixed(2)})</>
                )}
              </button>
              <p className="secure-payment-note">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-cart-note">
          <div className="note-icon">ℹ️</div>
          <p>Add items to your cart to proceed with checkout and payment</p>
        </div>
      )}
    </div>
  )
}

export default PaymentsTab
