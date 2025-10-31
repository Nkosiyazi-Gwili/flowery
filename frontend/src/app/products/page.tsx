'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Header from '../../components/Header';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stockQuantity: number;
  inStock: boolean;
  vendor?: {
    _id: string;
    businessName: string;
    name: string;
  };
}

// API base URL - uses environment variable for production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'roses',
    'lilies', 
    'tulips',
    'sunflowers',
    'orchids',
    'mixed',
    'seasonal'
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      
      // Handle different API response structures
      if (response.data.products) {
        // New API structure with products array
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        // Direct array response
        setProducts(response.data);
      } else if (response.data.success && response.data.data) {
        // Success wrapper with data array
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
      setError('');
    } catch (error: any) {
      console.error('Error fetching products:', error);
      
      // More specific error handling
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        setError('Unable to connect to the server. Please try again later.');
      } else if (error.response?.status === 404) {
        setError('Products endpoint not found.');
      } else if (error.message?.includes('Failed to fetch')) {
        setError('Unable to reach the server. Please check your connection.');
      } else {
        setError('Unable to load products. Please try again later.');
      }
      
      // Set empty array to trigger sample data display
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced sample products data
  const sampleProducts: Product[] = [
    {
      _id: '1',
      name: 'Red Rose Bouquet',
      description: 'Beautiful red roses arranged in an elegant bouquet, perfect for romantic occasions.',
      price: 45.99,
      images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400'],
      category: 'roses',
      stockQuantity: 15,
      inStock: true,
      vendor: { _id: 'v1', businessName: 'Rose Garden Florist', name: 'Sarah Wilson' }
    },
    {
      _id: '2',
      name: 'Sunflower Arrangement',
      description: 'Bright and cheerful sunflowers that bring sunshine to any room.',
      price: 35.50,
      images: ['https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=400'],
      category: 'sunflowers',
      stockQuantity: 8,
      inStock: true,
      vendor: { _id: 'v2', businessName: 'Sunny Blooms', name: 'Mike Johnson' }
    },
    {
      _id: '3',
      name: 'White Lily Elegance',
      description: 'Pure white lilies symbolizing purity and beauty in a stunning arrangement.',
      price: 52.00,
      images: ['https://images.unsplash.com/photo-1578911372313-1e70f573e5b5?w=400'],
      category: 'lilies',
      stockQuantity: 12,
      inStock: true,
      vendor: { _id: 'v3', businessName: 'Lily Palace', name: 'Emily Davis' }
    },
    {
      _id: '4',
      name: 'Tulip Spring Mix',
      description: 'Colorful tulips representing the beauty of spring in a vibrant mix.',
      price: 38.75,
      images: ['https://images.unsplash.com/photo-1582794543139-8ac9cad0c8ce?w=400'],
      category: 'tulips',
      stockQuantity: 0,
      inStock: false,
      vendor: { _id: 'v4', businessName: 'Tulip Time', name: 'Robert Brown' }
    },
    {
      _id: '5',
      name: 'Orchid Delight',
      description: 'Exotic orchids that add a touch of elegance and sophistication.',
      price: 65.00,
      images: ['https://images.unsplash.com/photo-1487070183333-3c4e16b9eb47?w=400'],
      category: 'orchids',
      stockQuantity: 6,
      inStock: true,
      vendor: { _id: 'v5', businessName: 'Orchid Oasis', name: 'Lisa Anderson' }
    },
    {
      _id: '6',
      name: 'Mixed Seasonal Bouquet',
      description: 'A beautiful mix of seasonal flowers perfect for any occasion.',
      price: 42.99,
      images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400'],
      category: 'mixed',
      stockQuantity: 20,
      inStock: true,
      vendor: { _id: 'v6', businessName: 'Seasonal Blooms', name: 'David Miller' }
    },
    {
      _id: '7',
      name: 'Premium Rose Collection',
      description: 'Luxury roses in a premium arrangement for special moments.',
      price: 75.00,
      images: ['https://images.unsplash.com/photo-1572451479134-8a4dc43a8a04?w=400'],
      category: 'roses',
      stockQuantity: 10,
      inStock: true,
      vendor: { _id: 'v7', businessName: 'Premium Florals', name: 'Jennifer Taylor' }
    },
    {
      _id: '8',
      name: 'Wildflower Meadow',
      description: 'A rustic arrangement of wildflowers bringing natural beauty indoors.',
      price: 32.50,
      images: ['https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=400'],
      category: 'mixed',
      stockQuantity: 0,
      inStock: false,
      vendor: { _id: 'v8', businessName: 'Wildflower Co.', name: 'Chris Wilson' }
    }
  ];

  // Use actual products if available, otherwise use samples
  const displayProducts = products.length > 0 ? products : sampleProducts;

  // Filter products based on search and category
  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sampleImages = [
    'https://images.unsplash.com/photo-1487070183333-3c4e16b9eb47?w=400',
    'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400',
    'https://images.unsplash.com/photo-1578911372313-1e70f573e5b5?w=400',
    'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=400',
    'https://images.unsplash.com/photo-1572451479134-8a4dc43a8a04?w=400'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Beautiful Collection</h1>
          <p className="text-xl text-gray-600">Fresh flowers from local florists and nurseries</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-yellow-700">{error}</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Showing sample products. Real products will appear when connected to the backend.
                </p>
              </div>
              <button 
                onClick={fetchProducts}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 text-sm"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Flowers
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search for flowers, bouquets..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading beautiful flowers...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.images?.[0] || sampleImages[index % sampleImages.length]} 
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = sampleImages[index % sampleImages.length];
                        }}
                      />
                      {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          Out of Stock
                        </div>
                      )}
                      {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          Low Stock
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-2 text-gray-800 group-hover:text-green-600 transition duration-300">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <p className="text-green-600 font-bold text-lg mb-4">R{product.price}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          By {product.vendor?.businessName || 'Local Florist'}
                        </span>
                        <Link 
                          href={`/products/${product._id}`}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🌼</div>
                  <p className="text-gray-500 text-lg mb-2">No products found</p>
                  <p className="text-gray-400">Try adjusting your search filters</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}