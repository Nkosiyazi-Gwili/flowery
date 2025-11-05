'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Header from '../components/Header';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  vendor: {
    businessName: string;
    name: string;
  };
  inStock: boolean;
  isActive: boolean;
}

// API base URL - uses environment variable for production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://flowery-back-end.vercel.app/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      
      // Handle different response structures
      if (response.data.products) {
        // New API structure
        const activeProducts = response.data.products.filter((product: Product) => 
          product.isActive !== false && product.inStock !== false
        );
        setProducts(activeProducts.slice(0, 8)); // Show only first 8 products
      } else if (response.data.success && response.data.data) {
        // Alternative API structure
        setProducts(response.data.data.slice(0, 8));
      } else if (Array.isArray(response.data)) {
        // Direct array response
        setProducts(response.data.slice(0, 8));
      } else {
        setProducts([]);
      }
      setError('');
    } catch (error: any) {
      console.error('Error fetching products:', error);
      
      // More specific error messages
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        setError('Unable to connect to the server. Please try again later.');
      } else if (error.response?.status === 404) {
        setError('Products endpoint not found.');
      } else if (error.message?.includes('Failed to fetch')) {
        setError('Unable to reach the server. Please check your connection.');
      } else {
        setError('Unable to load products. Please try again later.');
      }
      
      // Set empty products array to show sample data
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced sample product data for better fallback
  const sampleProducts: Product[] = [
    {
      _id: '1',
      name: 'Red Rose Bouquet',
      price: 45.99,
      images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400'],
      category: 'roses',
      vendor: { businessName: 'Rose Garden Florist', name: 'Sarah Wilson' },
      inStock: true,
      isActive: true
    },
    {
      _id: '2',
      name: 'Sunflower Arrangement',
      price: 35.50,
      images: ['https://images.unsplash.com/photo-1597848212624-e6d4bd7d5027?w=400'],
      category: 'sunflowers',
      vendor: { businessName: 'Sunny Blooms', name: 'Mike Johnson' },
      inStock: true,
      isActive: true
    },
    {
      _id: '3',
      name: 'Lily Elegance',
      price: 52.00,
      images: ['https://images.unsplash.com/photo-1578911372313-1e70f573e5b5?w=400'],
      category: 'lilies',
      vendor: { businessName: 'Lily Palace', name: 'Emily Davis' },
      inStock: true,
      isActive: true
    },
    {
      _id: '4',
      name: 'Tulip Spring Mix',
      price: 38.75,
      images: ['https://images.unsplash.com/photo-1582794543139-8ac9cad0c8ce?w=400'],
      category: 'tulips',
      vendor: { businessName: 'Tulip Time', name: 'Robert Brown' },
      inStock: true,
      isActive: true
    },
    {
      _id: '5',
      name: 'Orchid Delight',
      price: 65.00,
      images: ['https://images.unsplash.com/photo-1487070183333-3c4e16b9eb47?w=400'],
      category: 'orchids',
      vendor: { businessName: 'Orchid Oasis', name: 'Lisa Anderson' },
      inStock: true,
      isActive: true
    },
    {
      _id: '6',
      name: 'Mixed Seasonal Bouquet',
      price: 42.99,
      images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400'],
      category: 'mixed',
      vendor: { businessName: 'Seasonal Blooms', name: 'David Miller' },
      inStock: true,
      isActive: true
    },
    {
      _id: '7',
      name: 'Premium Rose Collection',
      price: 75.00,
      images: ['https://images.unsplash.com/photo-1578911372313-1e70f573e5b5?w=400'],
      category: 'roses',
      vendor: { businessName: 'Premium Florals', name: 'Jennifer Taylor' },
      inStock: true,
      isActive: true
    },
    {
      _id: '8',
      name: 'Wildflower Meadow',
      price: 32.50,
      images: ['https://images.unsplash.com/photo-1597848212624-e6d4bd7d5027?w=400'],
      category: 'mixed',
      vendor: { businessName: 'Wildflower Co.', name: 'Chris Wilson' },
      inStock: true,
      isActive: true
    }
  ];

  // Use actual products if available, otherwise use samples
  const displayProducts = products.length > 0 ? products : sampleProducts;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Flowery</h1>
          <p className="text-xl mb-8">Beautiful flowers delivered fresh to your doorstep</p>
          <Link 
            href="/products" 
            className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-yellow-700">{error}</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Showing sample products. Real products will appear when the backend is connected.
                </p>
              </div>
              <button 
                onClick={fetchProducts}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Flowers</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading beautiful flowers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Fallback to Unsplash images if product image fails
                      target.src = `https://images.unsplash.com/photo-${[
                        '1563241527-3004b7be0ffd',
                        '1597848212624-e6d4bd7d5027',
                        '1578911372313-1e70f573e5b5',
                        '1582794543139-8ac9cad0c8ce'
                      ][index % 4]}?w=400`;
                    }}
                  />
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-green-600 transition duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                   {product.vendor && product.vendor.businessName ? (
                    <p className="text-gray-600 text-sm mb-2">
                      {product.vendor.businessName}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm mb-2">
                      Flowery Vendor
                    </p>
                  )}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold text-lg">
                      R{product.price}
                    </span>
                    <div className="flex gap-2">
                      {product.inStock ? (
                        <Link 
                          href={`/products/${product._id}`}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 text-sm"
                        >
                          View Details
                        </Link>
                      ) : (
                        <button 
                          disabled
                          className="bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-blue-600 transition duration-300 inline-block"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Fresh flowers delivered within hours to your doorstep</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Florists</h3>
              <p className="text-gray-600">Supporting local businesses and nurseries</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Quality</h3>
              <p className="text-gray-600">Premium quality flowers guaranteed fresh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Roses', 'Lilies', 'Tulips', 'Sunflowers', 'Orchids', 'Mixed Bouquets', 'Seasonal', 'Wedding'].map((category, index) => (
              <Link 
                key={category}
                href={`/products?category=${category.toLowerCase().replace(' ', '-')}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition duration-300">
                  {['🌹', '💮', '🌷', '🌻', '🌸', '💐', '🌺', '🥀'][index]}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition duration-300">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Brighten Someone's Day?</h2>
          <p className="text-xl mb-8">Join thousands of happy customers who trust Flowery for their floral needs</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/products" 
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
            >
              Shop All Flowers
            </Link>
            <Link 
              href="/auth/register?role=vendor" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition duration-300"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Flowery. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Beautiful flowers for every occasion</p>
        </div>
      </footer>
    </div>
  );
}