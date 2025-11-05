'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '../../../components/Header';
import Link from 'next/link';

// API base URL - uses environment variable for production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://flowery-back-end.vercel.app/api';

interface Vendor {
  _id?: string;
  businessName: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stockQuantity: number;
  inStock: boolean;
  vendor?: Vendor;
  vendorBusinessName?: string;
  vendorName?: string;
  tags?: string[];
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/products/${productId}?populate=vendor`);
      
      // Handle different response structures
      let productData: Product | null = null;
      
      if (response.data.product) {
        productData = response.data.product;
      } else if (response.data) {
        productData = response.data;
      } else {
        setError('Product not found');
        return;
      }

      // Process vendor data to ensure it's properly structured
      if (productData) {
        const processedProduct: Product = {
          ...productData,
          vendor: productData.vendor ? {
            _id: productData.vendor._id || 'unknown',
            businessName: productData.vendor.businessName || productData.vendorBusinessName || 'Local Florist',
            name: productData.vendor.name || productData.vendorName || 'Unknown Vendor'
          } : {
            businessName: productData.vendorBusinessName || 'Local Florist',
            name: productData.vendorName || 'Unknown Vendor'
          }
        };
        setProduct(processedProduct);
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      
      // More specific error handling
      if (error.response?.status === 404) {
        setError('Product not found');
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        setError('Unable to connect to server. Please try again later.');
      } else {
        setError('Failed to load product details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely get vendor business name
  const getVendorBusinessName = (product: Product): string => {
    if (product.vendor?.businessName) {
      return product.vendor.businessName;
    }
    if (product.vendorBusinessName) {
      return product.vendorBusinessName;
    }
    return 'Local Florist';
  };

  // Helper function to safely get vendor contact name
  const getVendorContactName = (product: Product): string => {
    if (product.vendor?.name) {
      return product.vendor.name;
    }
    if (product.vendorName) {
      return product.vendorName;
    }
    return 'Unknown Vendor';
  };

  // Simple cart function for demo - replace with your actual cart implementation
  const addToCart = (product: Product, quantity: number) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cartItems.findIndex((item: any) => item._id === product._id);
      
      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({
          ...product,
          quantity: quantity,
          cartId: Date.now().toString()
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      const success = addToCart(product, quantity);
      
      if (success) {
        // Dispatch custom event to update cart icon
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Show success message
        alert(`${quantity} ${product.name} added to cart!`);
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    const success = addToCart(product, quantity);
    if (success) {
      window.dispatchEvent(new Event('cartUpdated'));
      router.push('/cart');
    } else {
      alert('Failed to add product to cart');
    }
  };

  // Sample product data for fallback
  const sampleProduct: Product = {
    _id: '1',
    name: 'Beautiful Flower Bouquet',
    description: 'A stunning arrangement of fresh flowers perfect for any occasion. These beautiful blooms are carefully selected and arranged by our expert florists to bring joy and beauty to your space.',
    price: 45.99,
    images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600'],
    category: 'mixed',
    stockQuantity: 10,
    inStock: true,
    vendor: {
      businessName: 'Rose Paradise Florist',
      name: 'Sarah Wilson'
    },
    tags: ['bouquet', 'fresh', 'arrangement']
  };

  // Use actual product if available, otherwise use sample for demo
  const displayProduct = product || sampleProduct;

  // Safely get vendor information
  const vendorBusinessName = getVendorBusinessName(displayProduct);
  const vendorContactName = getVendorContactName(displayProduct);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌼</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              href="/products" 
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 inline-block"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Error Banner for when we have product but also error */}
        {error && product && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-yellow-700">{error}</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Showing product information. Some features may not work properly.
                </p>
              </div>
              <button 
                onClick={fetchProduct}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600 transition duration-300">Home</Link>
          <span>›</span>
          <Link href="/products" className="hover:text-green-600 transition duration-300">Products</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{displayProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={displayProduct.images[0] || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600'}
                alt={displayProduct.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600';
                }}
              />
            </div>
            {displayProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayProduct.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${displayProduct.name} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-green-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=200';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayProduct.name}</h1>
              <p className="text-2xl text-green-600 font-bold mb-4">R{displayProduct.price}</p>
              <p className="text-gray-600 mb-4">
                Sold by: <span className="font-semibold text-gray-800">{vendorBusinessName}</span>
              </p>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">{displayProduct.description}</p>
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600 capitalize">{displayProduct.category}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Availability:</span>
                <span className={`ml-2 font-medium ${displayProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {displayProduct.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              {displayProduct.stockQuantity > 0 && (
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Stock:</span>
                  <span className="ml-2 text-gray-600">{displayProduct.stockQuantity} units available</span>
                </div>
              )}
              {displayProduct.tags && displayProduct.tags.length > 0 && (
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {displayProduct.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart Section */}
            {displayProduct.inStock ? (
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="font-semibold text-gray-700 text-lg">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                  >
                    {Array.from({ length: Math.min(10, displayProduct.stockQuantity || 10) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    Max: {displayProduct.stockQuantity || 10} available
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-green-500 text-white py-4 px-8 rounded-lg hover:bg-green-600 transition duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {addingToCart ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Adding...
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-500 text-white py-4 px-8 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-700 font-semibold text-lg">This product is currently out of stock.</p>
                <p className="text-red-600 text-sm mt-2">Please check back later or browse similar products.</p>
                <Link 
                  href="/products" 
                  className="inline-block mt-3 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Browse Available Products
                </Link>
              </div>
            )}

            {/* Vendor Info */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-3">About the Vendor</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Business:</span> {vendorBusinessName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span> {vendorContactName}
                </p>
                <p className="text-gray-600 text-sm mt-3">
                  Supporting local businesses and bringing you the freshest flowers.
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-semibold text-green-900 text-lg mb-3">🚚 Fast Delivery</h3>
              <ul className="text-green-800 space-y-1">
                <li>• Fresh flowers delivered within hours</li>
                <li>• Free delivery on orders over R50</li>
                <li>• Quality guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}