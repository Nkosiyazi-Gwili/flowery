// components/Header.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import CartIcon from './CartIcon';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">🌸</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-600">Flowery</h1>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">Fresh flowers delivered</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-green-600 transition duration-300 font-medium relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* Cart Icon */}
            <CartIcon />
            
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Vendor Dashboard */}
                {user.role === 'vendor' && (
                  <Link 
                    href="/vendor/dashboard" 
                    className="text-gray-700 hover:text-green-600 transition duration-300 font-medium relative group"
                  >
                    Dashboard
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                
                {/* Admin Dashboard */}
                {user.role === 'admin' && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-gray-700 hover:text-green-600 transition duration-300 font-medium relative group"
                  >
                    Dashboard
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                
                {/* My Orders */}
                <Link 
                  href="/orders" 
                  className="text-gray-700 hover:text-green-600 transition duration-300 font-medium relative group"
                >
                  Orders
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                      Hello, {user.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  
                  {/* Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition duration-300">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-2">
                        <Link 
                          href="/profile" 
                          className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-300"
                        >
                          👤 My Profile
                        </Link>
                        <Link 
                          href="/orders" 
                          className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition duration-300"
                        >
                          📦 My Orders
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition duration-300"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-green-600 transition duration-300 font-medium relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <CartIcon />
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              {isMenuOpen ? (
                <span className="text-xl">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-green-600 transition duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                🌸 Products
              </Link>
              
              {user ? (
                <>
                  {/* Vendor Dashboard */}
                  {user.role === 'vendor' && (
                    <Link 
                      href="/vendor/dashboard" 
                      className="text-gray-700 hover:text-green-600 transition duration-300 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📊 Vendor Dashboard
                    </Link>
                  )}
                  
                  {/* Admin Dashboard */}
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="text-gray-700 hover:text-green-600 transition duration-300 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  
                  {/* My Orders */}
                  <Link 
                    href="/orders" 
                    className="text-gray-700 hover:text-green-600 transition duration-300 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📦 My Orders
                  </Link>

                  {/* User Info */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {user.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        href="/profile" 
                        className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex-1 text-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2 border-t border-gray-200">
                  <Link 
                    href="/auth/login" 
                    className="text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="text-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}