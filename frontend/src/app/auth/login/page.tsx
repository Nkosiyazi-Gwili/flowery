'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Demo accounts data
const demoAccounts = [
  {
    role: '👑 Admin',
    email: 'admin@flowery.com',
    password: 'Admin123!',
    description: 'Full system access'
  },
  {
    role: '🌸 Florist',
    email: 'rose@flowery.com', 
    password: 'Florist123!',
    description: 'Rose Paradise Florist'
  },
  {
    role: '🌿 Nursery',
    email: 'greenthumb@flowery.com',
    password: 'Nursery123!',
    description: 'Green Thumb Nursery'
  },
  {
    role: '👥 Customer',
    email: 'emma@flowery.com',
    password: 'Customer123!',
    description: 'Emma Wilson - Regular customer'
  },
  {
    role: '👥 Customer',
    email: 'james@flowery.com',
    password: 'Customer123!',
    description: 'James Rodriguez - Regular customer'
  }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  const handleDemoAccountClick = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleQuickLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      await login(demoEmail, demoPassword);
      router.push('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl text-white font-bold">🌸</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Flowery</h1>
          <p className="text-gray-600">Beautiful flowers delivered fresh</p>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-green-200 group-hover:text-green-100" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Sign in to Flowery
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Flowery?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                href="/auth/register" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Create your Flowery account
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </form>
        </div>

        {/* Demo Accounts Section - Now positioned under the form */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium mb-4"
          >
            {showDemoAccounts ? 'Hide Demo Accounts' : 'Show Demo Accounts'}
            <svg 
              className={`ml-1 h-4 w-4 transition-transform ${showDemoAccounts ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showDemoAccounts && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              🚀 Demo Accounts - Quick Login
            </h3>
            <div className="space-y-3">
              {demoAccounts.map((account, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{account.role}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {account.description}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        📧 {account.email}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDemoAccountClick(account.email, account.password)}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        Fill
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(account.email, account.password)}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800 text-center">
                💡 <strong>Tip:</strong> Click "Fill" to populate credentials, or "Login" for instant access
              </p>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="text-center">
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-green-600">🚚</span>
              </div>
              <span>Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-green-600">🌿</span>
              </div>
              <span>Local Florists</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-green-600">💐</span>
              </div>
              <span>Fresh Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}