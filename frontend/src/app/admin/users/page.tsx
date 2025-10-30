// app/admin/users.tsx
'use client';

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'florist';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin: string;
  orders: number;
  totalSpent: string;
  avatar?: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR-001',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-17',
      orders: 12,
      totalSpent: '$1,234.00'
    },
    {
      id: 'USR-002',
      name: 'Mike Wilson',
      email: 'mike@email.com',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-17',
      orders: 8,
      totalSpent: '$890.50'
    },
    {
      id: 'USR-003',
      name: 'Emily Davis',
      email: 'emily@email.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-17',
      orders: 0,
      totalSpent: '$0.00'
    },
    {
      id: 'USR-004',
      name: 'Robert Brown',
      email: 'robert@email.com',
      role: 'florist',
      status: 'active',
      joinDate: '2024-01-08',
      lastLogin: '2024-01-16',
      orders: 0,
      totalSpent: '$0.00'
    },
    {
      id: 'USR-005',
      name: 'Lisa Anderson',
      email: 'lisa@email.com',
      role: 'customer',
      status: 'inactive',
      joinDate: '2024-01-03',
      lastLogin: '2024-01-10',
      orders: 3,
      totalSpent: '$345.00'
    },
    {
      id: 'USR-006',
      name: 'David Miller',
      email: 'david@email.com',
      role: 'customer',
      status: 'suspended',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-16',
      orders: 1,
      totalSpent: '$67.99'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: User['role']) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      customer: 'bg-blue-100 text-blue-800 border-blue-200',
      florist: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[role];
  };

  const getStatusColor = (status: User['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status];
  };

  const updateUserRole = (userId: string, newRole: User['role']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const updateUserStatus = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-purple-400 to-pink-400',
      'bg-gradient-to-br from-blue-400 to-cyan-400',
      'bg-gradient-to-br from-green-400 to-emerald-400',
      'bg-gradient-to-br from-orange-400 to-red-400',
      'bg-gradient-to-br from-indigo-400 to-purple-400',
      'bg-gradient-to-br from-pink-400 to-rose-400'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage your customers, florists, and administrators</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-800">{users.length}</h3>
              </div>
              <div className="text-3xl text-blue-500">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Users</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {users.filter(u => u.status === 'active').length}
                </h3>
              </div>
              <div className="text-3xl text-green-500">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Customers</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {users.filter(u => u.role === 'customer').length}
                </h3>
              </div>
              <div className="text-3xl text-purple-500">💐</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Florists</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {users.filter(u => u.role === 'florist').length}
                </h3>
              </div>
              <div className="text-3xl text-orange-500">🌷</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4 flex-wrap">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="florist">Florist</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex gap-4 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search users by name or email..."
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
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Join Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Login</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Orders</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(user.name)}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as User['role'])}
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                        <option value="florist">Florist</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.status}
                        onChange={(e) => updateUserStatus(user.id, e.target.value as User['status'])}
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.status)} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.joinDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {user.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">{user.totalSpent}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {/* View user details */}}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
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
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-600">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}