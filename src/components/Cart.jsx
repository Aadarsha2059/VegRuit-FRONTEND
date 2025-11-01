import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
                <Link to="/" className="text-green-600 hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item._id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                            <img src={`http://localhost:5001${item.image}`} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-gray-600">Rs. {item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded">
                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1">-</button>
                                <span className="px-4">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1">+</button>
                            </div>
                            <p className="font-semibold w-24 text-right">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                                &times;
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-right">
                <div className="text-2xl font-bold">
                    <span>Total: </span>
                    <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-sm">Shipping & taxes calculated at checkout.</p>
                <Link to="/checkout">
                    <button className="bg-green-600 text-white py-3 px-8 mt-4 rounded-lg font-semibold hover:bg-green-700 transition">
                        Proceed to Checkout
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Cart;