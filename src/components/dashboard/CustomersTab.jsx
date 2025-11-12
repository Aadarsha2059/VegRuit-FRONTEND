import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import logoFinal from '../../assets/logofinal.png';
import './CustomersTab.css';

const CustomersTab = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [sendingBill, setSendingBill] = useState(false);

  // Get unique customers from orders with "received" status
  const getCustomersWithReceivedOrders = () => {
    const customersMap = new Map();
    
    orders.forEach(order => {
      if (order.status === 'received' || order.status === 'delivered') {
        const customerId = order.buyer?._id || order.buyerId;
        if (!customersMap.has(customerId)) {
          customersMap.set(customerId, {
            id: customerId,
            name: order.buyerName || `${order.buyer?.firstName} ${order.buyer?.lastName}`,
            email: order.buyerEmail || order.buyer?.email,
            phone: order.buyerPhone || order.buyer?.phone,
            orders: []
          });
        }
        customersMap.get(customerId).orders.push(order);
      }
    });
    
    return Array.from(customersMap.values());
  };

  const customers = getCustomersWithReceivedOrders();

  const handleCheckBill = (customer) => {
    // Get the most recent received order for this customer
    const recentOrder = customer.orders.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    
    setSelectedOrder({ ...recentOrder, customer });
    setShowBillModal(true);
  };

  const handleSendBill = async () => {
    if (!selectedOrder) return;

    setSendingBill(true);
    try {
      // Simulate sending email (you'll need to implement the actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Bill sent successfully to ${selectedOrder.customer.email}`);
      setShowBillModal(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to send bill. Please try again.');
    } finally {
      setSendingBill(false);
    }
  };

  const handlePrintBill = () => {
    window.print();
  };

  const BillModal = () => {
    if (!selectedOrder) return null;

    const { customer } = selectedOrder;
    const billDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const orderDate = new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="bill-modal-overlay" onClick={() => setShowBillModal(false)}>
        <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
          <div className="bill-actions-top">
            <button className="close-btn" onClick={() => setShowBillModal(false)}>✕</button>
          </div>

          <div className="bill-content" id="bill-to-print">
            {/* Bill Header */}
            <div className="bill-header">
              <div className="bill-logo">
                <img src={logoFinal} alt="VegRuit Logo" />
              </div>
              <div className="bill-company-info">
                <h1>VegRuit</h1>
                <p>Fresh from Kathmandu</p>
                <p>Kathmandu, Nepal</p>
                <p>Phone: +977-1-XXXXXXX</p>
                <p>Email: info@vegrui t.com</p>
              </div>
            </div>

            <div className="bill-title">
              <h2>INVOICE</h2>
              <div className="bill-meta">
                <p><strong>Invoice #:</strong> {selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</p>
                <p><strong>Date:</strong> {billDate}</p>
                <p><strong>Order Date:</strong> {orderDate}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bill-section">
              <h3>Bill To:</h3>
              <div className="customer-details">
                <p><strong>{customer.name}</strong></p>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
                {selectedOrder.deliveryAddress && (
                  <p>Address: {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bill-section">
              <table className="bill-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName || item.name}</td>
                      <td>{item.quantity} {item.unit}</td>
                      <td>Rs. {item.price?.toFixed(2)}</td>
                      <td>Rs. {(item.quantity * item.price)?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bill Summary */}
            <div className="bill-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs. {selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              {selectedOrder.deliveryFee > 0 && (
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>Rs. {selectedOrder.deliveryFee?.toFixed(2)}</span>
                </div>
              )}
              {selectedOrder.tax > 0 && (
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>Rs. {selectedOrder.tax?.toFixed(2)}</span>
                </div>
              )}
              {selectedOrder.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount:</span>
                  <span>- Rs. {selectedOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span><strong>Total Amount:</strong></span>
                <span><strong>Rs. {selectedOrder.total?.toFixed(2) || '0.00'}</strong></span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bill-section payment-info">
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'COD'}</p>
              <p><strong>Payment Status:</strong> <span className={`status-badge ${selectedOrder.paymentStatus}`}>
                {selectedOrder.paymentStatus || 'Pending'}
              </span></p>
            </div>

            {/* Footer */}
            <div className="bill-footer">
              <p>Thank you for your business!</p>
              <p className="bill-note">This is a computer-generated invoice and does not require a signature.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bill-actions">
            <button className="btn-print" onClick={handlePrintBill}>
              🖨️ Print Bill
            </button>
            <button 
              className="btn-send" 
              onClick={handleSendBill}
              disabled={sendingBill}
            >
              {sendingBill ? '📧 Sending...' : '📧 Send Bill to Email'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="customers-tab">
      <div className="customers-header">
        <h2>Customer Management</h2>
        <p>Manage customers with received orders and send bills</p>
      </div>

      {customers.length === 0 ? (
        <div className="no-customers">
          <div className="no-customers-icon">👥</div>
          <h3>No Customers with Received Orders</h3>
          <p>Customers who have received their orders will appear here</p>
        </div>
      ) : (
        <div className="customers-grid">
          {customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-avatar">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="customer-info">
                <h3>{customer.name}</h3>
                <p className="customer-email">📧 {customer.email}</p>
                <p className="customer-phone">📱 {customer.phone}</p>
                <p className="customer-orders">
                  📦 {customer.orders.length} Received Order{customer.orders.length > 1 ? 's' : ''}
                </p>
              </div>
              <button 
                className="check-bill-btn"
                onClick={() => handleCheckBill(customer)}
              >
                📄 Check Bills
              </button>
            </div>
          ))}
        </div>
      )}

      {showBillModal && <BillModal />}
    </div>
  );
};

export default CustomersTab;
