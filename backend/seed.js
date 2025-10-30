const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowery';

// Enhanced Demo Accounts with realistic data
const demoAccounts = {
  // Admin Accounts
  admins: [
    {
      name: 'Flowery Administrator',
      email: 'admin@flowery.com',
      password: 'Admin123!',
      role: 'admin',
      phone: '+1 (555) 010-0001',
      address: '123 Flower Street, Garden City, GC 10001'
    },
    {
      name: 'System Manager',
      email: 'manager@flowery.com',
      password: 'Manager123!',
      role: 'admin',
      phone: '+1 (555) 010-0002',
      address: '456 Blossom Avenue, Bloomington, BL 10002'
    }
  ],

  // Florist Vendors
  florists: [
    {
      name: 'Rose Paradise',
      email: 'rose@flowery.com',
      password: 'Florist123!',
      role: 'vendor',
      vendorType: 'florist',
      businessName: 'Rose Paradise Florist',
      phone: '+1 (555) 020-0001',
      address: '789 Rose Boulevard, Petalville, PV 20001',
      description: 'Premium roses and romantic arrangements since 2010'
    },
    {
      name: 'Tulip Dreams',
      email: 'tulip@flowery.com',
      password: 'Florist123!',
      role: 'vendor',
      vendorType: 'florist',
      businessName: 'Tulip Dreams Florist',
      phone: '+1 (555) 020-0002',
      address: '321 Tulip Street, Springfield, SF 20002',
      description: 'Specializing in tulips and seasonal spring flowers'
    },
    {
      name: 'Lily Elegance',
      email: 'lily@flowery.com',
      password: 'Florist123!',
      role: 'vendor',
      vendorType: 'florist',
      businessName: 'Lily Elegance Florist',
      phone: '+1 (555) 020-0003',
      address: '654 Lily Lane, Garden City, GC 20003',
      description: 'Elegant lilies and sophisticated wedding arrangements'
    },
    {
      name: 'Orchid Majesty',
      email: 'orchid@flowery.com',
      password: 'Florist123!',
      role: 'vendor',
      vendorType: 'florist',
      businessName: 'Orchid Majesty Florist',
      phone: '+1 (555) 020-0004',
      address: '987 Orchid Road, Blossom Hills, BH 20004',
      description: 'Exotic orchids and premium floral designs'
    }
  ],

  // Nursery Vendors
  nurseries: [
    {
      name: 'Green Thumb Nursery',
      email: 'greenthumb@flowery.com',
      password: 'Nursery123!',
      role: 'vendor',
      vendorType: 'nursery',
      businessName: 'Green Thumb Plant Nursery',
      phone: '+1 (555) 030-0001',
      address: '246 Plant Street, Growtown, GT 30001',
      description: 'Your local plant experts with 20+ years of experience'
    },
    {
      name: 'Bloom & Grow',
      email: 'bloom@flowery.com',
      password: 'Nursery123!',
      role: 'vendor',
      vendorType: 'nursery',
      businessName: 'Bloom & Grow Nursery',
      phone: '+1 (555) 030-0002',
      address: '135 Garden Avenue, Plantville, PV 30002',
      description: 'Quality plants and gardening supplies for every home'
    },
    {
      name: 'Succulent Haven',
      email: 'succulent@flowery.com',
      password: 'Nursery123!',
      role: 'vendor',
      vendorType: 'nursery',
      businessName: 'Succulent Haven Nursery',
      phone: '+1 (555) 030-0003',
      address: '579 Cactus Road, Desert Springs, DS 30003',
      description: 'Specialists in succulents, cacti, and low-maintenance plants'
    }
  ],

  // Customer Accounts
  customers: [
    {
      name: 'Emma Wilson',
      email: 'emma@flowery.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1 (555) 040-0001',
      address: '100 Customer Road, Client City, CC 40001'
    },
    {
      name: 'James Rodriguez',
      email: 'james@flowery.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1 (555) 040-0002',
      address: '200 Buyer Street, Purchase Town, PT 40002'
    },
    {
      name: 'Sarah Chen',
      email: 'sarah@flowery.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1 (555) 040-0003',
      address: '300 Shopper Avenue, Retail City, RC 40003'
    },
    {
      name: 'Michael Brown',
      email: 'michael@flowery.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1 (555) 040-0004',
      address: '400 Consumer Lane, Market Ville, MV 40004'
    },
    {
      name: 'Lisa Thompson',
      email: 'lisa@flowery.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1 (555) 040-0005',
      address: '500 Client Boulevard, Service City, SC 40005'
    }
  ]
};

// Enhanced Product Catalog with realistic data
const enhancedProducts = [
  // Rose Paradise Florist Products
  {
    name: 'Classic Red Roses Bouquet',
    description: 'A dozen premium long-stemmed red roses, perfectly arranged with baby\'s breath and greenery. Symbolizes deep love and passion.',
    price: 79.99,
    category: 'Roses',
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 25,
    tags: ['romantic', 'anniversary', 'valentine', 'premium', 'red-roses']
  },
  {
    name: 'Pink Rose Elegance Arrangement',
    description: 'Soft pink roses complemented by white hydrangeas and eucalyptus in a crystal vase. Perfect for birthdays and celebrations.',
    price: 65.99,
    category: 'Roses',
    images: [
      'https://images.unsplash.com/photo-1578948856697-db91d246b7b1?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    tags: ['pink', 'elegant', 'birthday', 'celebration', 'luxury']
  },
  {
    name: 'Rainbow Rose Collection',
    description: 'Stunning mix of multicolored roses including red, pink, yellow, and white. A vibrant and joyful arrangement.',
    price: 89.99,
    category: 'Roses',
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 12,
    tags: ['colorful', 'rainbow', 'mixed', 'vibrant', 'special-occasion']
  },

  // Tulip Dreams Florist Products
  {
    name: 'Dutch Tulip Festival Bouquet',
    description: 'Vibrant mix of red, yellow, and purple Dutch tulips that bring the essence of spring indoors.',
    price: 45.99,
    category: 'Tulips',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 35,
    tags: ['dutch', 'spring', 'colorful', 'fresh', 'seasonal']
  },
  {
    name: 'White Tulip Serenity',
    description: 'Pure white tulips symbolizing purity, forgiveness, and new beginnings. Ideal for weddings and sympathy.',
    price: 42.99,
    category: 'Tulips',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 28,
    tags: ['white', 'pure', 'wedding', 'sympathy', 'elegant']
  },
  {
    name: 'Pink Tulip Romance',
    description: 'Soft pink tulips expressing affection and caring feelings. Perfect for showing someone you care.',
    price: 48.99,
    category: 'Tulips',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 22,
    tags: ['pink', 'romance', 'affection', 'caring', 'spring']
  },

  // Lily Elegance Florist Products
  {
    name: 'Stargazer Lily Extravaganza',
    description: 'Fragrant pink stargazer lilies known for their vibrant colors and intoxicating scent. Long-lasting beauty.',
    price: 68.99,
    category: 'Lilies',
    images: [
      'https://images.unsplash.com/photo-1572451479134-8a4dc43a8a04?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 20,
    tags: ['stargazer', 'fragrant', 'pink', 'luxury', 'long-lasting']
  },
  {
    name: 'White Calla Lily Elegance',
    description: 'Sophisticated white calla lilies in a modern arrangement. Perfect for weddings and formal events.',
    price: 75.99,
    category: 'Lilies',
    images: [
      'https://images.unsplash.com/photo-1572451479134-8a4dc43a8a04?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 15,
    tags: ['calla', 'white', 'wedding', 'formal', 'sophisticated']
  },
  {
    name: 'Mixed Lily Symphony',
    description: 'Beautiful combination of Asiatic, Oriental, and LA hybrid lilies in one stunning arrangement.',
    price: 82.99,
    category: 'Lilies',
    images: [
      'https://images.unsplash.com/photo-1572451479134-8a4dc43a8a04?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    tags: ['mixed', 'variety', 'luxury', 'premium', 'symphony']
  },

  // Orchid Majesty Florist Products
  {
    name: 'Phalaenopsis Orchid Plant',
    description: 'Beautiful purple moth orchid in decorative ceramic pot. Low maintenance and blooms last for months.',
    price: 39.99,
    category: 'Orchids',
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 30,
    tags: ['phalaenopsis', 'purple', 'indoor', 'low-maintenance', 'elegant']
  },
  {
    name: 'White Orchid Elegance',
    description: 'Pure white orchids symbolizing beauty, luxury, and strength. Perfect for home or office decor.',
    price: 44.99,
    category: 'Orchids',
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 25,
    tags: ['white', 'elegant', 'luxury', 'decor', 'premium']
  },
  {
    name: 'Mini Orchid Collection',
    description: 'Set of 3 mini orchids in different colors. Perfect for small spaces and as gifts.',
    price: 54.99,
    category: 'Orchids',
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 20,
    tags: ['mini', 'collection', 'gift', 'small-space', 'colorful']
  },

  // Green Thumb Nursery Products
  {
    name: 'Succulent Garden Box',
    description: 'Collection of 6 different succulent varieties in a rustic wooden box. Low maintenance and modern.',
    price: 34.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 45,
    tags: ['succulent', 'collection', 'low-maintenance', 'modern', 'indoor']
  },
  {
    name: 'Peace Lily Plant',
    description: 'Air-purifying peace lily that removes toxins and brings tranquility to any space. Easy to care for.',
    price: 24.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 35,
    tags: ['peace-lily', 'air-purifying', 'indoor', 'easy-care', 'health']
  },
  {
    name: 'Snake Plant Sansevieria',
    description: 'Extremely hardy snake plant that thrives on neglect. Perfect for beginners and busy people.',
    price: 29.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1593693397697-15ac76dfc5fe?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 40,
    tags: ['snake-plant', 'hardy', 'beginner', 'low-light', 'air-purifying']
  },

  // Bloom & Grow Nursery Products
  {
    name: 'Sunflower Sunshine Bouquet',
    description: 'Bright and cheerful sunflowers that bring instant happiness and summer vibes to any room.',
    price: 47.99,
    category: 'Sunflowers',
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 28,
    tags: ['sunflower', 'summer', 'happy', 'bright', 'cheerful']
  },
  {
    name: 'Herb Garden Starter Kit',
    description: 'Complete kit with basil, mint, rosemary, and thyme. Perfect for kitchen gardening.',
    price: 32.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 50,
    tags: ['herb', 'kitchen', 'starter-kit', 'cooking', 'fresh']
  },
  {
    name: 'Lavender Plant Bundle',
    description: 'Set of 3 lavender plants known for their calming scent and beautiful purple flowers.',
    price: 38.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1593693397697-15ac76dfc5fe?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 30,
    tags: ['lavender', 'calming', 'fragrant', 'medicinal', 'purple']
  },

  // Succulent Haven Nursery Products
  {
    name: 'Rare Succulent Collection',
    description: 'Collection of 4 rare succulent varieties for the serious collector. Includes care guide.',
    price: 49.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 15,
    tags: ['rare', 'succulent', 'collector', 'unique', 'special']
  },
  {
    name: 'Cactus Garden Assortment',
    description: 'Assortment of 5 different cactus varieties in a desert-themed arrangement.',
    price: 41.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 25,
    tags: ['cactus', 'desert', 'low-water', 'unique', 'decor']
  },
  {
    name: 'Hanging Succulent Basket',
    description: 'Beautiful arrangement of trailing succulents in a hanging basket. Perfect for patios.',
    price: 36.99,
    category: 'Plants',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'
    ],
    stock: 20,
    tags: ['hanging', 'trailing', 'patio', 'outdoor', 'decorative']
  }
];

// Enhanced Sample Orders with realistic scenarios
const enhancedOrders = [
  // Emma's Orders
  {
    customer: null, // Will be populated
    items: [
      { product: null, quantity: 1, price: 79.99 }, // Classic Red Roses
      { product: null, quantity: 1, price: 39.99 }  // Phalaenopsis Orchid
    ],
    totalAmount: 119.98,
    status: 'delivered',
    shippingAddress: {
      street: '100 Customer Road',
      city: 'Client City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    customer: null,
    items: [
      { product: null, quantity: 2, price: 34.99 }  // Succulent Garden Box
    ],
    totalAmount: 69.98,
    status: 'out_for_delivery',
    shippingAddress: {
      street: '100 Customer Road',
      city: 'Client City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },

  // James's Orders
  {
    customer: null,
    items: [
      { product: null, quantity: 1, price: 68.99 }, // Stargazer Lily
      { product: null, quantity: 1, price: 47.99 }  // Sunflower Bouquet
    ],
    totalAmount: 116.98,
    status: 'preparing',
    shippingAddress: {
      street: '200 Buyer Street',
      city: 'Purchase Town',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },

  // Sarah's Orders
  {
    customer: null,
    items: [
      { product: null, quantity: 1, price: 65.99 }, // Pink Rose Elegance
      { product: null, quantity: 1, price: 32.99 }  // Herb Garden Kit
    ],
    totalAmount: 98.98,
    status: 'confirmed',
    shippingAddress: {
      street: '300 Shopper Avenue',
      city: 'Retail City',
      state: 'TX',
      zipCode: '75001',
      country: 'USA'
    },
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },

  // Michael's Orders
  {
    customer: null,
    items: [
      { product: null, quantity: 1, price: 89.99 }  // Rainbow Rose Collection
    ],
    totalAmount: 89.99,
    status: 'pending',
    shippingAddress: {
      street: '400 Consumer Lane',
      city: 'Market Ville',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    paymentStatus: 'pending',
    createdAt: new Date() // Today
  },

  // Lisa's Orders
  {
    customer: null,
    items: [
      { product: null, quantity: 1, price: 75.99 }, // White Calla Lily
      { product: null, quantity: 1, price: 49.99 }  // Rare Succulent Collection
    ],
    totalAmount: 125.98,
    status: 'delivered',
    shippingAddress: {
      street: '500 Client Boulevard',
      city: 'Service City',
      state: 'IL',
      zipCode: '60007',
      country: 'USA'
    },
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
  }
];

async function seedAdvanced() {
  try {
    console.log('🌱 Starting Enhanced Database Seeding...');
    console.log('=========================================\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Users
    console.log('👥 Creating Demo Accounts...');
    console.log('----------------------------');
    
    const allUsers = [];
    
    // Create Admins
    for (const adminData of demoAccounts.admins) {
      const admin = new User(adminData);
      await admin.save();
      allUsers.push(admin);
      console.log(`✅ ADMIN: ${admin.name} (${admin.email})`);
    }

    // Create Florists
    const florists = [];
    for (const floristData of demoAccounts.florists) {
      const florist = new User(floristData);
      await florist.save();
      allUsers.push(florist);
      florists.push(florist);
      console.log(`✅ FLORIST: ${florist.businessName} (${florist.email})`);
    }

    // Create Nurseries
    const nurseries = [];
    for (const nurseryData of demoAccounts.nurseries) {
      const nursery = new User(nurseryData);
      await nursery.save();
      allUsers.push(nursery);
      nurseries.push(nursery);
      console.log(`✅ NURSERY: ${nursery.businessName} (${nursery.email})`);
    }

    // Create Customers
    const customers = [];
    for (const customerData of demoAccounts.customers) {
      const customer = new User(customerData);
      await customer.save();
      allUsers.push(customer);
      customers.push(customer);
      console.log(`✅ CUSTOMER: ${customer.name} (${customer.email})`);
    }

    console.log(`\n📊 Created ${allUsers.length} total users\n`);

    // Create Products
    console.log('💐 Creating Enhanced Product Catalog...');
    console.log('--------------------------------------');
    
    const allProducts = [];
    const vendors = [...florists, ...nurseries];
    
    for (let i = 0; i < enhancedProducts.length; i++) {
      const vendor = vendors[i % vendors.length];
      const productData = {
        ...enhancedProducts[i],
        vendor: vendor._id
      };
      
      const product = new Product(productData);
      await product.save();
      allProducts.push(product);
      console.log(`✅ ${product.category.toUpperCase()}: ${product.name} - $${product.price} (${vendor.businessName})`);
    }

    console.log(`\n📊 Created ${allProducts.length} products across ${vendors.length} vendors\n`);

    // Create Orders
    console.log('📦 Creating Sample Orders...');
    console.log('---------------------------');
    
    const allOrders = [];
    
    for (let i = 0; i < enhancedOrders.length; i++) {
      const orderData = enhancedOrders[i];
      const customer = customers[i % customers.length];
      
      // Assign actual products to order items
      const orderItems = orderData.items.map((item, index) => {
        const productIndex = (i * 2 + index) % allProducts.length;
        const product = allProducts[productIndex];
        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price
        };
      });

      // Recalculate total amount
      const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      const order = new Order({
        ...orderData,
        items: orderItems,
        totalAmount,
        customer: customer._id
      });

      await order.save();
      allOrders.push(order);
      console.log(`✅ ORDER #${order.orderNumber}: ${customer.name} - $${totalAmount} - ${order.status}`);
    }

    console.log(`\n📊 Created ${allOrders.length} orders for ${customers.length} customers\n`);

    // Generate Summary Report
    console.log('🎉 ENHANCED SEEDING COMPLETED SUCCESSFULLY!');
    console.log('===========================================\n');
    
    console.log('📈 SEEDING SUMMARY:');
    console.log('-------------------');
    console.log(`👑 Admin Accounts: ${demoAccounts.admins.length}`);
    console.log(`🏪 Vendor Accounts: ${florists.length + nurseries.length}`);
    console.log(`   ├── Florists: ${florists.length}`);
    console.log(`   └── Nurseries: ${nurseries.length}`);
    console.log(`👥 Customer Accounts: ${customers.length}`);
    console.log(`💐 Products Created: ${allProducts.length}`);
    console.log(`📦 Orders Generated: ${allOrders.length}\n`);

    console.log('🔐 DEMO ACCOUNT CREDENTIALS:');
    console.log('----------------------------');
    console.log('👑 ADMIN ACCOUNTS:');
    demoAccounts.admins.forEach(admin => {
      console.log(`   📧 ${admin.email} | 🔑 ${admin.password} | 👤 ${admin.name}`);
    });

    console.log('\n🏪 VENDOR ACCOUNTS:');
    demoAccounts.florists.forEach(florist => {
      console.log(`   📧 ${florist.email} | 🔑 ${florist.password} | 🌸 ${florist.businessName}`);
    });
    demoAccounts.nurseries.forEach(nursery => {
      console.log(`   📧 ${nursery.email} | 🔑 ${nursery.password} | 🌿 ${nursery.businessName}`);
    });

    console.log('\n👥 CUSTOMER ACCOUNTS:');
    demoAccounts.customers.forEach(customer => {
      console.log(`   📧 ${customer.email} | 🔑 ${customer.password} | 👤 ${customer.name}`);
    });

    console.log('\n🌐 APPLICATION ACCESS:');
    console.log('---------------------');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend API: http://localhost:5000');
    console.log('\n💡 TESTING TIPS:');
    console.log('---------------');
    console.log('   1. Login as Admin to manage users and view all orders');
    console.log('   2. Login as Vendor to manage products and view your orders');
    console.log('   3. Login as Customer to browse products and place orders');
    console.log('   4. Test different order statuses and payment scenarios');
    console.log('   5. Explore vendor-specific product management');

  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedAdvanced().catch(console.error);
}

module.exports = { seedAdvanced, demoAccounts };