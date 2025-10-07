import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { createOrder } from '../services/orderAPI';
import { initializePayment } from '../services/paymentAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user ? `${user.firstName} ${user.lastName}` : '',
            phone: user ? user.phone : '',
            address: user ? user.address : '',
            city: user ? user.city : 'Kathmandu',
        }
    });
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [loading, setLoading] = useState(false);

    const deliveryFee = cartTotal > 1000 ? 0 : 50;
    const finalAmount = cartTotal + deliveryFee;

    const onSubmit = async (data) => {
        setLoading(true);
        const toastId = toast.loading('Placing your order...');

        if (cartItems.length === 0) {
            toast.error('Your cart is empty.', { id: toastId });
            setLoading(false);
            return;
        }

        // Assuming all items from one seller for simplicity
        const sellerId = cartItems[0].seller._id;

        const orderData = {
            seller: sellerId,
            items: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price,
                unit: 'kg' // Assuming kg for now, should be in product data
            })),
            deliveryAddress: data,
            paymentMethod,
            totalAmount: cartTotal,
            deliveryFee,
            finalAmount,
        };

        try {
            const newOrder = await createOrder(orderData);
            toast.success('Order placed successfully!', { id: toastId });

            if (paymentMethod === 'cash_on_delivery') {
                clearCart();
                navigate(`/order-success/${newOrder._id}`);
            } else {
                // Initialize online payment
                const paymentInitData = await initializePayment({
                    orderId: newOrder._id,
                    paymentMethod,
                });
                
                // Redirect to payment gateway (simulation)
                // In a real app, you'd use the gateway's SDK or redirect
                toast.loading(`Redirecting to ${paymentMethod}...`, { duration: 2000 });
                console.log('Gateway Data:', paymentInitData.gatewayData);
                
                // For now, simulate success
                setTimeout(() => {
                    clearCart();
                    navigate(`/order-success/${newOrder._id}`);
                }, 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order.', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Delivery & Payment */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">1. Delivery Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Form fields */}
                        <div>
                            <label>Full Name</label>
                            <input {...register('fullName', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <input {...register('phone', { required: true })} className="input-field" />
                        </div>
                        <div className="md:col-span-2">
                            <label>Address</label>
                            <input {...register('address', { required: true })} className="input-field" />
                        </div>
                        <div>
                            <label>City</label>
                            <input {...register('city', { required: true })} className="input-field" />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-8 mb-4">2. Payment Method</h2>
                    <div className="space-y-3">
                        {/* Payment Options */}
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                            <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio" />
                            <span className="ml-3">Cash on Delivery</span>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                            <input type="radio" name="paymentMethod" value="esewa" checked={paymentMethod === 'esewa'} onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio" />
                            <span className="ml-3">eSewa</span>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                            <input type="radio" name="paymentMethod" value="khalti" checked={paymentMethod === 'khalti'} onChange={(e) => setPaymentMethod(e.target.value)} className="form-radio" />
                            <span className="ml-3">Khalti</span>
                        </label>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">3. Order Summary</h2>
                    <div className="space-y-2">
                        {cartItems.map(item => (
                            <div key={item._id} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4" />
                    <div className="space-y-2 font-medium">
                        <div className="flex justify-between"><span>Subtotal</span><span>Rs. {cartTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Delivery Fee</span><span>Rs. {deliveryFee.toFixed(2)}</span></div>
                        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>Rs. {finalAmount.toFixed(2)}</span></div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 mt-6 rounded-lg font-semibold hover:bg-green-700 transition">
                        {loading ? 'Processing...' : `Place Order (Rs. ${finalAmount.toFixed(2)})`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;