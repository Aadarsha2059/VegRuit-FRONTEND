import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import logoFinal from '../../assets/logofinal.png';
import './BillDetails.css';

const BillDetails = ({ order, customer, onClose, onSendBill }) => {
  const [sending, setSending] = useState(false);

  const handleSendBill = async () => {
    setSending(true);
    try {
      await onSendBill(order, customer);
      toast.success(`Bill sent successfully to ${customer.email}`);
      onClose();
    } catch (error) {
      toast.error('Failed to send bill');
    } finally {
      setSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateSubtotal = () => {
    return order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  };

  const deliveryFee = order.deliveryFee || 50;
  const tax = order.tax || 0;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="bill-details-overlay" onClick={onClose}>
      <div className="bill-details-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-bill-btn" onClick={onClose}>✕</button>
        
        <div className="bill-content" id="bill-to-print">
          {/* Header with Logo */}
          <div className="bill-header">
            <div className="bill-logo-section">
              <img src={logoFinal} alt="VegRuit Logo" className="bill-logo" />
              <div className="bill-company-info">
                <h1>VegRuit</h1>
                <p>Fresh from Kathmandu</p>
                <p>Kathmandu, Nepal</p>
                <p>Phone: +977-1-XXXXXXX</p>
                <p>Email: info@vegruitshop.com</p>
              </div>
            </div>
            <div className="bill-invoice-info">
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> {order.orderNumber || order._id?.slice(-8)}</p>
              <p><strong>Date:</strong> {new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${order.status}`}>{order.status}</span></p>
            </div>
          </div>

          <div className="bill-divider"></div>

          {/* Customer Details */}
          <div className="bill-customer-section">
            <div className="bill-to">
              <h3>Bill To:</h3>
              <p><strong>{customer.name || order.buyerName}</strong></p>
              <p>{customer.email || order.buyerEmail}</p>
              <p>{customer.phone || order.buyerPhone}</p>
              <p>{order.deliveryAddress?.street || 'N/A'}</p>
              <p>{order.deliveryAddress?.city || customer.city || 'N/A'}, {order.deliveryAddress?.state || 'Nepal'}</p>
            </div>
            <div className="bill-from">
              <h3>From:</h3>
              <p><strong>VegRuit Seller</strong></p>
              <p>Fresh Produce Supplier</p>
              <p>Kathmandu, Nepal</p>
            </div>
          </div>

          <div className="bill-divider"></div>

          {/* Items Table */}
          <div className="bill-items-section">
            <h3>Order Items</h3>
            <table className="bill-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName || item.name}</td>
                    <td>Rs. {item.price?.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit || 'kg'}</td>
                    <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bill-divider"></div>

          {/* Totals */}
          <div className="bill-totals-section">
            <div className="bill-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>Rs. {deliveryFee.toFixed(2)}</span>
              </div>
              {tax > 0 && (
                <div className="total-row">
                  <span>Tax (13%):</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
              )}
              <div className="bill-divider-thin"></div>
              <div className="total-row grand-total">
                <span><strong>Total Amount:</strong></span>
                <span><strong>Rs. {total.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bill-payment-section">
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'COD'}</p>
            <p><strong>Payment Status:</strong> <span className={`payment-status ${order.paymentStatus}`}>{order.paymentStatus || 'Pending'}</span></p>
          </div>

          {/* Footer */}
          <div className="bill-footer">
            <div className="bill-notes">
              <h4>Notes:</h4>
              <p>Thank you for your business! We appreciate your order.</p>
              <p>For any queries, please contact us at info@vegruitshop.com</p>
            </div>
            <div className="bill-signature">
              <div className="signature-line"></div>
              <p>VegRuit Nepal</p>
              <p className="signature-label">Authorized Signature</p>
            </div>
          </div>

          <div className="bill-footer-text">
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
            <p>© 2025 VegRuit. All rights reserved.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bill-actions">
          <button className="bill-action-btn print-btn" onClick={handlePrint}>
            🖨️ Print Bill
          </button>
          <button 
            className="bill-action-btn send-btn" 
            onClick={handleSendBill}
            disabled={sending}
          >
            {sending ? '📧 Sending...' : '📧 Send Bill to Email'}
          </button>
          <button className="bill-action-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
