'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCartItemCount } from '../lib/cart';

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const count = getCartItemCount();
      setItemCount(count);
    };

    updateCartCount();
    
    // Listen for storage changes to update cart count across tabs
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates within the same tab
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors">
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {itemCount}
        </span>
      )}
    </Link>
  );
}