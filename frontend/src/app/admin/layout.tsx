// src/app/admin/layout.tsx
'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
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

  if (!user || user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin-specific header/navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">Admin Portal</h1>
            <nav className="flex space-x-4">
              <a href="/admin/dashboard" className="text-gray-700 hover:text-green-600">
                Dashboard
              </a>
              <a href="/admin/products" className="text-gray-700 hover:text-green-600">
                Products
              </a>
              <a href="/admin/users" className="text-gray-700 hover:text-green-600">
                Users
              </a>
              <a href="/admin/orders" className="text-gray-700 hover:text-green-600">
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