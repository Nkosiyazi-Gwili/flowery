// src/app/vendor/layout.tsx
'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'vendor') {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor-specific header/navigation can go here */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">Vendor Portal</h1>
            <nav className="flex space-x-4">
              <a href="/vendor/dashboard" className="text-gray-700 hover:text-green-600">
                Dashboard
              </a>
              <a href="/vendor/products" className="text-gray-700 hover:text-green-600">
                Products
              </a>
              <a href="/vendor/orders" className="text-gray-700 hover:text-green-600">
                Orders
              </a>
            </nav>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}