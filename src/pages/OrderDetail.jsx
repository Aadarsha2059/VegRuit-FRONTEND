import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { orderAPI } from '../services/orderAPI';
import { STORAGE_KEYS } from '../services/authAPI';
import './OrderDetail.css';

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    useEffect(() => {
        if (!token) {
            navigate('/buyer-login');
            return;
        }
        fetchOrder();
    }, [orderId, token, navigate]);

    const fetchOrder = async () => {
        try {
            const response = await orderAPI.getOrder(token, orderId);
            if (response.success) {
                setOrder(response.data.order);
            } else {
                toast.error(response.message);
                navigate('/buyer-dashboard');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
            navigate('/buyer-dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { 
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
                icon: '⏳', 
                message: 'Your order is being processed',
                progress: 20
            },
            confirmed: { 
                color: 'bg-blue-100 text-blue-800 border-blue-200', 
                icon: '✅', 
                message: 'Order confirmed and being prepared',
                progress: 40
            },
            processing: { 
                color: 'bg-purple-100 text-purple-800 border-purple-200', 
                icon: '👨‍🍳', 
                message: 'Your fresh produce is being prepared',
                progress: 60
            },
            shipped: { 
                color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
                icon: '🚚', 
                message: 'On the way to your doorstep',
                progress: 80
            },
            delivered: { 
                color: 'bg-green-100 text-green-800 border-green-200', 
                icon: '🎉', 
                message: 'Successfully delivered!',
                progress: 100
            },
            cancelled: { 
                color: 'bg-red-100 text-red-800 border-red-200', 
                icon: '❌', 
                message: 'Order has been cancelled',
                progress: 0
            }
        };
        return statusMap[status] || statusMap.pending;
    };

    const getPaymentMethodInfo = (method) => {
        const methodMap = {
            cod: { name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive' },
            khalti: { name: 'Khalti', icon: '📱', description: 'Digital wallet payment' },
            esewa: { name: 'eSewa', icon: '💳', description: 'Online payment' }
        };
        return methodMap[method] || methodMap.cod;
    };

    if (loading) {
        return (
            <div className="order-detail-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-detail-error">
                <div className="error-container">
                    <div className="error-icon">😞</div>
                    <h2>Order Not Found</h2>
                    <p>We couldn't find the order you're looking for.</p>
                    <button onClick={() => navigate('/buyer-dashboard')} className="btn btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);
    const paymentInfo = getPaymentMethodInfo(order.paymentMethod);

    return (
        <div className="order-detail-page">
            <div className="order-detail-container">
                {/* Header Section */}
                <motion.div 
                    className="order-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <button onClick={() => navigate('/buyer-dashboard')} className="back-button">
                        <span className="back-icon">←</span>
                        Back to Dashboard
                    </button>
                    
                    <div className="order-title-section">
                        <h1 className="order-title">Order Details</h1>
                        <div className="order-meta">
                            <span className="order-number">#{order.orderNumber}</span>
                            <span className="order-date">
                                Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <motion.div 
                        className={`status-banner ${statusInfo.color}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="status-content">
                            <span className="status-icon">{statusInfo.icon}</span>
                            <div className="status-text">
                                <h3 className="status-title">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</h3>
                                <p className="status-message">{statusInfo.message}</p>
                            </div>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${statusInfo.progress}%` }}
                            ></div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="order-content">
                    {/* Main Content */}
                    <div className="order-main">
                        {/* Order Items */}
                        <motion.div 
                            className="order-section order-items-section"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="section-icon">🛒</span>
                                    Items in Your Order
                                </h2>
                                <span className="items-count">{order.items?.length || 0} items</span>
                            </div>
                            
                            <div className="items-list">
                                {order.items?.map((item, index) => (
                                    <motion.div 
                                        key={item._id || index}
                                        className="order-item"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                                    >
                                        <div className="item-image">
                                            <img 
                                                src={item.productImage || `http://localhost:5001${item.productImage}` || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop'} 
                                                alt={item.productName}
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop';
                                                }}
                                            />
                                        </div>
                                        <div className="item-details">
                                            <h3 className="item-name">{item.productName}</h3>
                                            <p className="item-seller">by {item.sellerName}</p>
                                            <div className="item-specs">
                                                <span className="item-quantity">Qty: {item.quantity}</span>
                                                <span className="item-unit">{item.unit}</span>
                                            </div>
                                        </div>
                                        <div className="item-pricing">
                                            <div className="item-total">Rs. {item.total}</div>
                                            <div className="item-unit-price">Rs. {item.price} per {item.unit}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Order Timeline */}
                        <motion.div 
                            className="order-section timeline-section"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="section-icon">📍</span>
                                    Order Timeline
                                </h2>
                            </div>
                            
                            <div className="timeline">
                                <div className="timeline-item active">
                                    <div className="timeline-marker">
                                        <span className="timeline-icon">📝</span>
                                    </div>
                                    <div className="timeline-content">
                                        <h4>Order Placed</h4>
                                        <p>{new Date(order.orderDate).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                {order.confirmedAt && (
                                    <div className="timeline-item active">
                                        <div className="timeline-marker">
                                            <span className="timeline-icon">✅</span>
                                        </div>
                                        <div className="timeline-content">
                                            <h4>Order Confirmed</h4>
                                            <p>{new Date(order.confirmedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {order.processedAt && (
                                    <div className="timeline-item active">
                                        <div className="timeline-marker">
                                            <span className="timeline-icon">👨‍🍳</span>
                                        </div>
                                        <div className="timeline-content">
                                            <h4>Being Prepared</h4>
                                            <p>{new Date(order.processedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {order.shippedAt && (
                                    <div className="timeline-item active">
                                        <div className="timeline-marker">
                                            <span className="timeline-icon">🚚</span>
                                        </div>
                                        <div className="timeline-content">
                                            <h4>Out for Delivery</h4>
                                            <p>{new Date(order.shippedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className={`timeline-item ${order.status === 'delivered' ? 'active' : 'pending'}`}>
                                    <div className="timeline-marker">
                                        <span className="timeline-icon">🎉</span>
                                    </div>
                                    <div className="timeline-content">
                                        <h4>Delivered</h4>
                                        <p>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Pending delivery'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="order-sidebar">
                        {/* Order Summary */}
                        <motion.div 
                            className="order-section summary-section"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="section-icon">💰</span>
                                    Order Summary
                                </h2>
                            </div>
                            
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>Rs. {order.subtotal}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span>Rs. {order.deliveryFee}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax (13%)</span>
                                    <span>Rs. {order.tax}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="summary-row discount">
                                        <span>Discount</span>
                                        <span>-Rs. {order.discount}</span>
                                    </div>
                                )}
                                <div className="summary-row total">
                                    <span>Total Amount</span>
                                    <span>Rs. {order.total}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Information */}
                        <motion.div 
                            className="order-section payment-section"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="section-icon">💳</span>
                                    Payment Method
                                </h2>
                            </div>
                            
                            <div className="payment-info">
                                <div className="payment-method">
                                    <span className="payment-icon">{paymentInfo.icon}</span>
                                    <div className="payment-details">
                                        <h4>{paymentInfo.name}</h4>
                                        <p>{paymentInfo.description}</p>
                                    </div>
                                </div>
                                <div className={`payment-status ${order.paymentStatus}`}>
                                    {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                </div>
                            </div>
                        </motion.div>

                        {/* Delivery Information */}
                        <motion.div 
                            className="order-section delivery-section"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <div className="section-header">
                                <h2 className="section-title">
                                    <span className="section-icon">🏠</span>
                                    Delivery Address
                                </h2>
                            </div>
                            
                            <div className="delivery-info">
                                <div className="address-details">
                                    <p className="recipient-name">{order.buyerName}</p>
                                    <p className="address-line">{order.deliveryAddress?.street}</p>
                                    <p className="address-line">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                    <p className="address-line">{order.deliveryAddress?.country}</p>
                                    {order.deliveryAddress?.postalCode && (
                                        <p className="postal-code">Postal Code: {order.deliveryAddress.postalCode}</p>
                                    )}
                                </div>
                                <div className="contact-info">
                                    <p className="phone">📞 {order.buyerPhone}</p>
                                    <p className="email">📧 {order.buyerEmail}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Seller Information */}
                        {order.items && order.items.length > 0 && (
                            <motion.div 
                                className="order-section seller-section"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                            >
                                <div className="section-header">
                                    <h2 className="section-title">
                                        <span className="section-icon">👨‍🌾</span>
                                        Seller Information
                                    </h2>
                                </div>
                                
                                <div className="seller-info">
                                    <div className="seller-details">
                                        <h4>{order.items[0]?.sellerName || 'Local Farmer'}</h4>
                                        <p className="seller-type">Fresh Produce Supplier</p>
                                    </div>
                                    <div className="seller-rating">
                                        <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                                        <span className="rating-text">4.8 (124 reviews)</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div 
                            className="order-actions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            {order.status === 'delivered' && (
                                <button className="btn btn-primary">
                                    ⭐ Rate & Review
                                </button>
                            )}
                            {['pending', 'confirmed'].includes(order.status) && (
                                <button className="btn btn-outline">
                                    ❌ Cancel Order
                                </button>
                            )}
                            <button className="btn btn-outline">
                                📞 Contact Support
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;