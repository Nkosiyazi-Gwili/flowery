'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  vendorType?: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL - uses environment variable for production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Check for auth token on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          // Verify token is still valid with backend
          try {
            const response = await axios.get(`${API_BASE_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
              setUser(response.data.user);
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (error) {
            // Token validation failed, clear storage
            console.error('Token validation failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up axios interceptor for auth errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - token expired or invalid
          logout();
          setError('Your session has expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      clearError();

      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Validate response data
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to server. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Your account has been suspended. Please contact support.';
      }

      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      clearError();

      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      const { token, user: newUser } = response.data;
      
      if (!token || !newUser) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        errorMessage = Object.values(validationErrors).flat().join(', ');
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to server. Please try again later.';
      } else if (error.response?.status === 409) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid registration data. Please check your information.';
      }

      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear axios headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear state
      setUser(null);
      clearError();

      // Optional: Call logout endpoint to invalidate token on server
      // This would require adding a logout endpoint to your backend
      // axios.post(`${API_BASE_URL}/auth/logout`).catch(console.error);
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Auto-logout after token expiry (optional)
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiry = payload.exp * 1000; // Convert to milliseconds
          if (Date.now() > expiry) {
            logout();
            setError('Your session has expired. Please login again.');
          }
        } catch (error) {
          console.error('Error checking token expiry:', error);
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};