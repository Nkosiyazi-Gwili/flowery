// src/app/admin/dashboard/page.tsx
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
    },
    {
      icon: '💐',
      title: 'Total Orders',
      value: '456',
      change: '+8%',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '💰',
      title: 'Revenue',
      value: '$45,678',
      change: '+15%',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '⭐',
      title: 'Customer Satisfaction',
      value: '98%',
      change: '+2%',
      color: 'from-yellow-500 to-orange-500',
    }
  ];

  return (
    <div className="p-6">
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
                <div className="p-3 rounded-xl bg-gray-50">
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

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/admin/products" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💐</div>
              <p className="font-semibold text-blue-700 text-sm">Manage Products</p>
            </a>
            <a href="/admin/users" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
              <p className="font-semibold text-purple-700 text-sm">Manage Users</p>
            </a>
            <a href="/admin/orders" className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
              <p className="font-semibold text-green-700 text-sm">View Orders</p>
            </a>
            <a href="/admin/settings" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
              <p className="font-semibold text-orange-700 text-sm">Settings</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}