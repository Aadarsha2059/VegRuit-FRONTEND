import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/orderAPI';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (error) {
                toast.error('Failed to fetch order history.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-6">Loading your orders...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center bg-white p-10 rounded-lg shadow">
                    <p className="text-gray-600">You have not placed any orders yet.</p>
                    <Link to="/" className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope`="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {order.finalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* This can link to a detailed order page in the future */}
                                        <Link to={`/buyer-dashboard/orders/${order._id}`} className="text-green-600 hover:text-green-900">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;