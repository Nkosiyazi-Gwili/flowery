// app/orders/page.tsx
'use client';

import React, { useState } from 'react';

interface Order {
  id: string;
  customer: string;
  email: string;
  bouquet: string;
  flowers: string[];
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  deliveryType: 'home' | 'pickup';
  address?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'FL-001',
      customer: 'Sarah Johnson',
      email: 'sarah@email.com',
      bouquet: 'Rose Romance',
      flowers: ['Red Roses', 'Baby Breath', 'Fern'],
      amount: '$89.99',
      status: 'delivered',
      date: '2024-01-15',
      deliveryType: 'home',
      address: '123 Main St, City, State'
    },
    {
      id: 'FL-002',
      customer: 'Mike Wilson',
      email: 'mike@email.com',
      bouquet: 'Sunflower Bliss',
      flowers: ['Sunflowers', 'Daisies', 'Green Fillers'],
      amount: '$67.50',
      status: 'processing',
      date: '2024-01-16',
      deliveryType: 'pickup'
    },
    {
      id: 'FL-003',
      customer: 'Emily Davis',
      email: 'emily@email.com',
      bouquet: 'Lily Elegance',
      flowers: ['White Lilies', 'Orchids', 'Eucalyptus'],
      amount: '$120.00',
      status: 'shipped',
      date: '2024-01-16',
      deliveryType: 'home',
      address: '456 Oak Ave, City, State'
    },
    {
      id: 'FL-004',
      customer: 'Robert Brown',
      email: 'robert@email.com',
      bouquet: 'Mixed Spring',
      flowers: ['Tulips', 'Daffodils', 'Hyacinths'],
      amount: '$45.99',
      status: 'pending',
      date: '2024-01-17',
      deliveryType: 'home',
      address: '789 Pine Rd, City, State'
    },
    {
      id: 'FL-005',
      customer: 'Lisa Anderson',
      email: 'lisa@email.com',
      bouquet: 'Orchid Delight',
      flowers: ['Purple Orchids', 'Fern', 'Moss'],
      amount: '$95.00',
      status: 'cancelled',
      date: '2024-01-14',
      deliveryType: 'pickup'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.bouquet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: '⏳',
      processing: '🔄',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status];
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">🌸 Floral Orders</h1>
          <p className="text-lg text-gray-600">Manage and track flower arrangement orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-800">24</h3>
              </div>
              <div className="text-3xl">💐</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Delivered</p>
                <h3 className="text-3xl font-bold text-gray-800">18</h3>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending</p>
                <h3 className="text-3xl font-bold text-gray-800">4</h3>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Revenue</p>
                <h3 className="text-3xl font-bold text-gray-800">$2,456</h3>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-4 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search orders, customers, or bouquet names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                Search
              </button>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2">
              <span>+</span>
              New Order
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bouquet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Delivery</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-purple-600">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.bouquet}</div>
                        <div className="text-sm text-gray-500 flex flex-wrap gap-1 mt-1">
                          {order.flowers.map((flower, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {flower}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">{order.amount}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="processing">🔄 Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.deliveryType === 'home' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {order.deliveryType === 'home' ? '🏠 Home Delivery' : '🏪 Store Pickup'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {/* View order details */}}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => deleteOrder(order.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌼</div>
              <h3 className="text-lg font-semibold text-gray-600">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}