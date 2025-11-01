import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';

const OrderSuccess = () => {
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
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <div className="text-center p-10">Loading your order confirmation...</div>;
    }

    if (!order) {
        return <div className="text-center p-10">Could not find your order.</div>;
    }

    return (
        <div className="container mx-auto p-8 flex justify-center items-center min-h-[70vh]">
            <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg">
                <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
                    <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mt-6">Thank You For Your Order!</h1>
                <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>

                <div className="text-left bg-gray-50 p-4 rounded-lg mt-6">
                    <p className="font-semibold">
                        Order ID: <span className="font-normal text-gray-700">{order.orderId}</span>
                    </p>
                    <p className="font-semibold mt-2">
                        Estimated Delivery: <span className="font-normal text-gray-700">{new Date(order.estimatedDeliveryTime).toLocaleDateString()}</span>
                    </p>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    You will receive an email confirmation shortly. You can also track your order in your dashboard.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <BackButton />
                    <Link to="/buyer-dashboard/orders" className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition">
                        View My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;