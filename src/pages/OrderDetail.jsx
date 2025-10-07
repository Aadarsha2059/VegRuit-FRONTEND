import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/orderAPI';
import { toast } from 'react-hot-toast';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(orderId);
                setOrder(data);
            } catch (error) {
                toast.error('Could not fetch order details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const getStatusClass = (status) => {
        const statusClasses = {
            delivered: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            out_for_delivery: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-indigo-100 text-indigo-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-pink-100 text-pink-800',
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="p-6 text-center">Loading order details...</div>;
    }

    if (!order) {
        return <div className="p-6 text-center text-red-500">Failed to load order. Please try again.</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <Link to="/buyer-dashboard/orders" className="text-green-600 hover:text-green-800 font-medium">
                    &larr; Back to Orders
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 mt-2">Order Details</h1>
                <p className="text-gray-500">
                    Order #{order.orderId} &bull; Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Items in your order</h2>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.product._id} className="flex items-center gap-4 border-b border-gray-200 pb-4 last:border-b-0">
                                    <img 
                                        src={`http://localhost:5000${item.product.images[0]}`} 
                                        alt={item.product.name} 
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} {item.unit}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">Rs. {item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Tracking */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>
                        <ol className="relative border-l border-gray-200">
                            {order.trackingUpdates.map((update, index) => (
                                <li key={index} className="mb-6 ml-6">
                                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${getStatusClass(update.status)}`}>
                                        {/* You can add icons here */}
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 capitalize">
                                        {update.status.replace('_', ' ')}
                                    </h3>
                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                                        {new Date(update.timestamp).toLocaleString()}
                                    </time>
                                    <p className="text-base font-normal text-gray-500">{update.message}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(order.status)}`}>
                                    {order.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium">Rs. {order.totalAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Delivery Fee:</span><span className="font-medium">Rs. {order.deliveryFee.toFixed(2)}</span></div>
                            <div className="flex justify-between pt-2 border-t mt-2 text-base font-bold">
                                <span>Total:</span>
                                <span>Rs. {order.finalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold text-gray-800">{order.seller.farmName}</p>
                            <p className="text-gray-600">{order.seller.firstName} {order.seller.lastName}</p>
                            <p className="text-gray-600">{order.seller.phone}</p>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-semibold text-gray-800">{order.deliveryAddress.fullName}</p>
                            <p>{order.deliveryAddress.address}</p>
                            <p>{order.deliveryAddress.city}</p>
                            <p>Phone: {order.deliveryAddress.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
