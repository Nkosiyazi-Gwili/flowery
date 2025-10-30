// app/admin/dashboard.tsx
'use client';

import React from 'react';

export default function AdminDashboard() {
  const stats = [
    {
      icon: '👥',
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: '💐',
      title: 'Total Orders',
      value: '456',
      change: '+8%',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: '💰',
      title: 'Revenue',
      value: '$45,678',
      change: '+15%',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: '⭐',
      title: 'Customer Satisfaction',
      value: '98%',
      change: '+2%',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  const recentActivities = [
    { user: 'Sarah Johnson', action: 'placed a new order', time: '2 mins ago', icon: '🛒' },
    { user: 'Mike Wilson', action: 'created an account', time: '15 mins ago', icon: '👤' },
    { user: 'Emily Davis', action: 'wrote a review', time: '1 hour ago', icon: '⭐' },
    { user: 'Admin', action: 'updated product catalog', time: '2 hours ago', icon: '📦' },
    { user: 'Robert Brown', action: 'completed delivery', time: '3 hours ago', icon: '🚚' }
  ];

  const popularProducts = [
    { name: 'Rose Romance Bouquet', sales: 234, revenue: '$12,345' },
    { name: 'Sunflower Bliss', sales: 189, revenue: '$8,901' },
    { name: 'Lily Elegance', sales: 156, revenue: '$10,234' },
    { name: 'Mixed Spring Collection', sales: 143, revenue: '$7,890' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your flower shop today.</p>
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
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Products</h2>
            <div className="space-y-4">
              {popularProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">💐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 text-sm">{product.revenue}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
              <p className="font-semibold text-blue-700 text-sm">Manage Users</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💐</div>
              <p className="font-semibold text-purple-700 text-sm">View Orders</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
              <p className="font-semibold text-green-700 text-sm">Analytics</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
              <p className="font-semibold text-orange-700 text-sm">Settings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}