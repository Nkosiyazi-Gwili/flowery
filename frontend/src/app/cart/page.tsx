'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { Cart, CartItem } from '../../types';
import { getCart, updateQuantity, removeFromCart, clearCart } from '../../lib/cart';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(productId);
    setTimeout(() => {
      const updatedCart = updateQuantity(productId, newQuantity);
      setCart(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      setUpdating(null);
    }, 300);
  };

  const handleRemove = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      const emptyCart = clearCart();
      setCart(emptyCart);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any flowers to your cart yet.</p>
            <Link href="/products" className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})
                  </h2>
                </div>
                
                <div className="divide-y">
                  {cart.items.map((item: CartItem) => (
                    <div key={item.product._id} className="p-6">
                      <div className="flex space-x-4">
                        <img
                          src={item.product.images[0] || '/placeholder-flower.jpg'}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors">
                                <Link href={`/products/${item.product._id}`}>
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Sold by: {item.product.vendor.businessName}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-green-600">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updating === item.product._id}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">
                                {updating === item.product._id ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock || updating === item.product._id}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemove(item.product._id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2">
                            ${item.product.price} each
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>${(cart.total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(cart.total * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <Link href="/products" className="text-green-600 hover:text-green-700 font-medium text-sm">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}