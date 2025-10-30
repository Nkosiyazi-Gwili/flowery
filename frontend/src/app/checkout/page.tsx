'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Generate a random order number for demo purposes
    if (orderId) {
      setOrderNumber(`FLW-${orderId.slice(-8).toUpperCase()}`);
    } else {
      setOrderNumber(`FLW-${Date.now().toString().slice(-8)}`);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="text-gray-600 mb-8">
            Order Number: <span className="font-semibold text-green-600">{orderNumber}</span>
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <span>You will receive an order confirmation email shortly</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <span>Our florists are preparing your beautiful flowers</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <span>Your order will be delivered within 2-4 hours</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold"
            >
              View My Orders
            </Link>
            <Link
              href="/products"
              className="bg-white text-green-600 border border-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition duration-300 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Need help with your order?{' '}
              <Link href="/contact" className="font-semibold hover:text-blue-800">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}