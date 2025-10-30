// src/app/vendor/dashboard/page.tsx
'use client';

import React from 'react';

export default function VendorDashboard() {
  const stats = [
    {
      icon: '💐',
      title: 'My Products',
      value: '24',
      change: '+3',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: '📦',
      title: 'Total Orders',
      value: '156',
      change: '+12%',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: '💰',
      title: 'Revenue',
      value: '$8,742',
      change: '+18%',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: '⭐',
      title: 'Rating',
      value: '4.8/5',
      change: '+0.2',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  const recentOrders = [
    { id: 'FL-1234', customer: 'Sarah Johnson', product: 'Rose Bouquet', amount: '$45.99', status: 'Delivered' },
    { id: 'FL-1235', customer: 'Mike Wilson', product: 'Sunflower Arrangement', amount: '$35.50', status: 'Processing' },
    { id: 'FL-1236', customer: 'Emily Davis', product: 'Lily Collection', amount: '$52.00', status: 'Shipped' },
    { id: 'FL-1237', customer: 'Robert Brown', product: 'Mixed Spring', amount: '$38.75', status: 'Pending' }
  ];

  const lowStockProducts = [
    { name: 'Red Roses', stock: 3, threshold: 10 },
    { name: 'White Lilies', stock: 5, threshold: 10 },
    { name: 'Sunflowers', stock: 8, threshold: 15 },
    { name: 'Orchids', stock: 2, threshold: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your flower products and track your business performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <div className={`mt-3 h-2 bg-gradient-to-r ${stat.color} rounded-full`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">#{order.id}</h4>
                    <p className="text-xs text-gray-500">{order.customer} - {order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 text-sm">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Low Stock Alert</h2>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg">⚠️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">Only {product.stock} left</p>
                    </div>
                  </div>
                  <button className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition duration-300">
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/vendor/products" className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💐</div>
              <p className="font-semibold text-green-700 text-sm">My Products</p>
            </a>
            <a href="/vendor/orders" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</div>
              <p className="font-semibold text-blue-700 text-sm">View Orders</p>
            </a>
            <a href="/vendor/add-product" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</div>
              <p className="font-semibold text-purple-700 text-sm">Add Product</p>
            </a>
            <a href="/vendor/analytics" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
              <p className="font-semibold text-orange-700 text-sm">Analytics</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}