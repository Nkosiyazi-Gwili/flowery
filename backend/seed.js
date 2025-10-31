// seed-complete-data-with-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Bouquet = require('./models/Bouquet');
const Order = require('./models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gwilinkosiyazi1:v34FQ0k4xFWyPec3@cluster0.1ccukxh.mongodb.net/flowery?retryWrites=true&w=majority';

// Admin User
const adminUser = {
  name: 'Flowery Administrator',
  email: 'admin@flowery.com',
  password: 'Admin123!',
  role: 'admin',
  phone: '+1 (555) 000-0001',
  address: {
    street: '1 Flowery Headquarters',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94101',
    country: 'USA'
  },
  isActive: true,
  emailVerified: true
};

// Sample Users (Customers)
const sampleUsers = [
  {
    name: 'Emma Wilson',
    email: 'emma@flowery.com',
    password: 'Customer123!',
    role: 'customer',
    phone: '+1 (555) 010-1001',
    address: {
      street: '123 Rosewood Lane',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  },
  {
    name: 'James Rodriguez',
    email: 'james@flowery.com',
    password: 'Customer123!',
    role: 'customer',
    phone: '+1 (555) 010-1002',
    address: {
      street: '456 Blossom Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@flowery.com',
    password: 'Customer123!',
    role: 'customer',
    phone: '+1 (555) 010-1003',
    address: {
      street: '789 Petal Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  },
  {
    name: 'Michael Brown',
    email: 'michael@flowery.com',
    password: 'Customer123!',
    role: 'customer',
    phone: '+1 (555) 010-1004',
    address: {
      street: '321 Garden Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa@flowery.com',
    password: 'Customer123!',
    role: 'customer',
    phone: '+1 (555) 010-1005',
    address: {
      street: '654 Flower Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  }
];

// Sample Vendors
const sampleVendors = [
  {
    name: 'Rose Smith',
    email: 'rose@flowery.com',
    password: 'Vendor123!',
    businessName: 'Rose Paradise Florist',
    businessType: 'florist',
    phone: '+1 (555) 020-2001',
    address: {
      street: '123 Flower Market',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA'
    },
    description: 'Premium roses and romantic arrangements since 2010. Specializing in wedding and event florals.',
    services: ['Wedding Arrangements', 'Event Decor', 'Custom Bouquets', 'Delivery'],
    deliveryAreas: ['San Francisco', 'Oakland', 'San Jose'],
    businessHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '11:00', close: '15:00' }
    },
    isVerified: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 127
  },
  {
    name: 'John Green',
    email: 'greenthumb@flowery.com',
    password: 'Vendor123!',
    businessName: 'Green Thumb Nursery',
    businessType: 'nursery',
    phone: '+1 (555) 020-2002',
    address: {
      street: '456 Plant Boulevard',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95101',
      country: 'USA'
    },
    description: 'Your local plant experts with 25+ years of experience. Specializing in indoor plants and gardening supplies.',
    services: ['Plant Sales', 'Gardening Supplies', 'Landscaping', 'Plant Care Workshops'],
    deliveryAreas: ['San Jose', 'Santa Clara', 'Palo Alto'],
    businessHours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: { open: '10:00', close: '15:00' }
    },
    isVerified: true,
    isActive: true,
    rating: 4.6,
    reviewCount: 89
  },
  {
    name: 'Lily Chen',
    email: 'lily@flowery.com',
    password: 'Vendor123!',
    businessName: 'Lily Elegance Florist',
    businessType: 'florist',
    phone: '+1 (555) 020-2003',
    address: {
      street: '789 Blossom Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    description: 'Elegant floral designs for sophisticated events and corporate clients.',
    services: ['Corporate Events', 'Luxury Arrangements', 'Same-Day Delivery', 'Floral Subscriptions'],
    deliveryAreas: ['Manhattan', 'Brooklyn', 'Queens'],
    businessHours: {
      monday: { open: '08:30', close: '19:00' },
      tuesday: { open: '08:30', close: '19:00' },
      wednesday: { open: '08:30', close: '19:00' },
      thursday: { open: '08:30', close: '19:00' },
      friday: { open: '08:30', close: '19:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    isVerified: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 203
  }
];

// Sample Products
const sampleProducts = [
  // Rose Products
  {
    name: 'Premium Red Roses - Dozen',
    type: 'flower',
    category: 'roses',
    description: 'A dozen premium long-stemmed red roses, perfectly arranged with baby\'s breath and greenery. Symbolizes deep love and passion.',
    price: 79.99,
    cost: 45.00,
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 25,
    lowStockThreshold: 5,
    season: ['spring', 'summer', 'fall', 'winter'],
    colors: ['red'],
    fragrance: 'medium',
    careInstructions: 'Change water every 2 days and trim stems at an angle. Keep away from direct sunlight.',
    vaseLife: 7,
    tags: ['romantic', 'anniversary', 'valentine', 'premium', 'luxury'],
    isFeatured: true,
    isActive: true,
    popularity: 95,
    salesCount: 142
  },
  {
    name: 'Pink Rose Elegance Bouquet',
    type: 'flower',
    category: 'roses',
    description: 'Beautiful pink roses complemented by white hydrangeas and eucalyptus in a crystal vase.',
    price: 65.99,
    cost: 35.00,
    images: [
      'https://images.unsplash.com/photo-1578948856697-db91d246b7b1?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 18,
    lowStockThreshold: 5,
    season: ['spring', 'summer'],
    colors: ['pink', 'white'],
    fragrance: 'light',
    careInstructions: 'Keep in cool area away from direct sunlight. Change water every 3 days.',
    vaseLife: 6,
    tags: ['pink', 'elegant', 'birthday', 'celebration'],
    isFeatured: false,
    isActive: true,
    popularity: 78,
    salesCount: 87
  },

  // Lily Products
  {
    name: 'Stargazer Lily Bouquet',
    type: 'flower',
    category: 'lilies',
    description: 'Fragrant pink stargazer lilies known for their vibrant colors and intoxicating scent. Long-lasting beauty.',
    price: 68.99,
    cost: 38.00,
    images: [
      'https://images.unsplash.com/photo-1572451479134-8a4dc43a8a04?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 20,
    lowStockThreshold: 5,
    season: ['summer'],
    colors: ['pink', 'white'],
    fragrance: 'strong',
    careInstructions: 'Remove pollen to prevent staining and change water frequently. Keep in well-ventilated area.',
    vaseLife: 8,
    tags: ['stargazer', 'fragrant', 'luxury', 'long-lasting'],
    isFeatured: true,
    isActive: true,
    popularity: 82,
    salesCount: 93
  },

  // Tulip Products
  {
    name: 'Dutch Tulip Festival Bouquet',
    type: 'flower',
    category: 'tulips',
    description: 'Vibrant mix of red, yellow, and purple Dutch tulips that bring the essence of spring indoors.',
    price: 45.99,
    cost: 25.00,
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 35,
    lowStockThreshold: 5,
    season: ['spring'],
    colors: ['red', 'yellow', 'purple'],
    fragrance: 'light',
    careInstructions: 'Keep in cool water and away from fruits. Tulips continue to grow after cutting.',
    vaseLife: 5,
    tags: ['dutch', 'spring', 'colorful', 'fresh', 'seasonal'],
    isFeatured: true,
    isActive: true,
    popularity: 88,
    salesCount: 156
  },

  // Orchid Products
  {
    name: 'Phalaenopsis Orchid Plant',
    type: 'flower',
    category: 'orchids',
    description: 'Beautiful purple moth orchid in decorative ceramic pot. Low maintenance and blooms last for months.',
    price: 39.99,
    cost: 20.00,
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 30,
    lowStockThreshold: 5,
    season: ['spring', 'summer', 'fall', 'winter'],
    colors: ['purple'],
    fragrance: 'none',
    careInstructions: 'Water once a week and provide indirect sunlight. Avoid overwatering.',
    vaseLife: 90,
    tags: ['phalaenopsis', 'indoor', 'low-maintenance', 'elegant'],
    isFeatured: true,
    isActive: true,
    popularity: 91,
    salesCount: 204
  },

  // Sunflower Products
  {
    name: 'Sunflower Sunshine Bouquet',
    type: 'flower',
    category: 'sunflowers',
    description: 'Bright and cheerful sunflowers that bring instant happiness and summer vibes to any room.',
    price: 47.99,
    cost: 25.00,
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 28,
    lowStockThreshold: 5,
    season: ['summer', 'fall'],
    colors: ['yellow'],
    fragrance: 'none',
    careInstructions: 'Change water daily and trim stems regularly. Keep away from ethylene-producing fruits.',
    vaseLife: 7,
    tags: ['sunflower', 'summer', 'happy', 'bright', 'cheerful'],
    isFeatured: true,
    isActive: true,
    popularity: 86,
    salesCount: 178
  },

  // Greenery
  {
    name: 'Eucalyptus Greenery Bundle',
    type: 'greenery',
    category: 'mixed',
    description: 'Fresh eucalyptus branches perfect for arrangements and home decor. Adds texture and fragrance.',
    price: 24.99,
    cost: 12.00,
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 40,
    lowStockThreshold: 5,
    season: ['spring', 'summer', 'fall', 'winter'],
    colors: ['green'],
    fragrance: 'light',
    careInstructions: 'Can be used fresh or dried for long-lasting decor. Refresh with water mist.',
    vaseLife: 14,
    tags: ['eucalyptus', 'greenery', 'filler', 'decor', 'aromatic'],
    isFeatured: false,
    isActive: true,
    popularity: 68,
    salesCount: 89
  },

  // Filler Flowers
  {
    name: 'Baby\'s Breath Bundle',
    type: 'filler',
    category: 'mixed',
    description: 'Delicate baby\'s breath perfect for complementing arrangements or creating airy bouquets.',
    price: 19.99,
    cost: 8.00,
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 50,
    lowStockThreshold: 5,
    season: ['spring', 'summer', 'fall'],
    colors: ['white'],
    fragrance: 'none',
    careInstructions: 'Change water every 4-5 days. Can be dried for permanent arrangements.',
    vaseLife: 10,
    tags: ['filler', 'delicate', 'airy', 'complementary'],
    isFeatured: false,
    isActive: true,
    popularity: 61,
    salesCount: 134
  }
];

// Sample Bouquets
const sampleBouquets = [
  {
    name: 'Romantic Red Rose Bouquet',
    description: 'A stunning arrangement of premium red roses, perfect for anniversaries and romantic occasions.',
    basePrice: 89.99,
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80'
    ],
    size: 'large',
    occasion: ['anniversary', 'valentine', 'romantic'],
    colors: ['red'],
    style: 'luxury',
    isCustom: false,
    isActive: true,
    careInstructions: 'Change water every 2 days and trim stems. Keep in cool location.',
    tags: ['romantic', 'luxury', 'anniversary'],
    popularity: 92
  },
  {
    name: 'Spring Garden Medley',
    description: 'Fresh seasonal spring flowers including tulips, daffodils, and hyacinths celebrating new beginnings.',
    basePrice: 65.99,
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80'
    ],
    size: 'medium',
    occasion: ['birthday', 'spring', 'celebration'],
    colors: ['yellow', 'purple', 'pink', 'white'],
    style: 'traditional',
    isCustom: false,
    isActive: true,
    careInstructions: 'Perfect for spring celebrations. Keep in cool area and change water every 3 days.',
    tags: ['spring', 'seasonal', 'fresh', 'garden'],
    popularity: 85
  },
  {
    name: 'Sunshine Happiness Bouquet',
    description: 'Bright and cheerful arrangement featuring sunflowers and seasonal blooms to brighten any day.',
    basePrice: 55.99,
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    size: 'medium',
    occasion: ['get-well', 'birthday', 'thank-you'],
    colors: ['yellow', 'orange'],
    style: 'modern',
    isCustom: false,
    isActive: true,
    careInstructions: 'Change water daily and keep in bright, indirect light.',
    tags: ['happy', 'bright', 'cheerful', 'sunshine'],
    popularity: 78
  }
];

async function seedCompleteDataWithAdmin() {
  try {
    console.log('🚀 Starting Complete Data Seeding (With Admin)...');
    console.log('================================================\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    await Bouquet.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ All existing data cleared\n');

    // Create Admin User First
    console.log('👑 Creating Admin User...');
    console.log('------------------------');
    
    const hashedAdminPassword = await bcrypt.hash(adminUser.password, 12);
    const admin = new User({
      ...adminUser,
      password: hashedAdminPassword
    });
    await admin.save();
    console.log(`✅ ADMIN: ${admin.name} (${admin.email})`);
    console.log('   🔑 Password: Admin123!\n');

    // Create Users (Customers)
    console.log('👥 Creating Customers...');
    console.log('----------------------');
    
    const allUsers = [admin];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      allUsers.push(user);
      console.log(`✅ CUSTOMER: ${user.name} (${user.email})`);
    }
    console.log(`📊 Created ${allUsers.length} total users (1 admin + ${sampleUsers.length} customers)\n`);

    // Create Vendors
    console.log('🏪 Creating Vendors...');
    console.log('---------------------');
    
    const allVendors = [];
    for (const vendorData of sampleVendors) {
      const vendor = new Vendor(vendorData);
      await vendor.save();
      allVendors.push(vendor);
      console.log(`✅ VENDOR: ${vendor.businessName} (${vendor.businessType})`);
    }
    console.log(`📊 Created ${allVendors.length} vendors\n`);

    // Create Products
    console.log('💐 Creating Products...');
    console.log('----------------------');
    
    const allProducts = [];
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
      allProducts.push(product);
      console.log(`✅ PRODUCT: ${product.category} - ${product.name}`);
    }
    console.log(`📊 Created ${allProducts.length} products\n`);

    // Create Bouquets with flower relationships
    console.log('💐 Creating Bouquets...');
    console.log('----------------------');
    
    const allBouquets = [];
    for (let i = 0; i < sampleBouquets.length; i++) {
      const bouquetData = sampleBouquets[i];
      
      // Assign flowers to bouquets based on their type
      const bouquetFlowers = allProducts
        .filter(product => {
          if (i === 0) return product.category === 'roses'; // Romantic bouquet gets roses
          if (i === 1) return product.category === 'tulips' || product.type === 'filler'; // Spring bouquet
          if (i === 2) return product.category === 'sunflowers'; // Sunshine bouquet
          return true;
        })
        .slice(0, 3) // Take first 3 matching products
        .map(product => ({
          product: product._id,
          quantity: Math.floor(Math.random() * 3) + 1 // 1-3 of each flower
        }));

      const bouquet = new Bouquet({
        ...bouquetData,
        flowers: bouquetFlowers
      });
      await bouquet.save();
      allBouquets.push(bouquet);
      console.log(`✅ BOUQUET: ${bouquet.name} (${bouquet.flowers.length} flower types)`);
    }
    console.log(`📊 Created ${allBouquets.length} bouquets\n`);

    // Create Sample Orders
    console.log('📦 Creating Sample Orders...');
    console.log('---------------------------');
    
    const allOrders = [];
    const orderTemplates = [
      {
        bouquet: allBouquets[0]._id, // Romantic bouquet
        deliveryType: 'home',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        specialInstructions: 'Please include a happy anniversary note',
        status: 'confirmed'
      },
      {
        bouquet: allBouquets[1]._id, // Spring bouquet
        deliveryType: 'pickup',
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        specialInstructions: 'For birthday celebration',
        status: 'processing'
      },
      {
        bouquet: allBouquets[2]._id, // Sunshine bouquet
        deliveryType: 'home',
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        specialInstructions: 'Get well soon message',
        status: 'pending'
      }
    ];

    for (let i = 0; i < orderTemplates.length && i < sampleUsers.length; i++) {
      const orderTemplate = orderTemplates[i];
      const customer = allUsers.find(u => u.email === sampleUsers[i].email); // Find the actual customer
      const bouquet = allBouquets[i % allBouquets.length];

      if (customer) {
        // Get flowers for this bouquet to include in order
        const bouquetFlowers = await Bouquet.findById(bouquet._id).populate('flowers.product');
        const orderFlowers = bouquetFlowers.flowers.map(item => ({
          flower: item.product._id,
          quantity: item.quantity
        }));

        const order = new Order({
          customer: customer._id,
          bouquet: bouquet._id,
          flowers: orderFlowers,
          totalAmount: bouquet.basePrice,
          status: orderTemplate.status,
          deliveryType: orderTemplate.deliveryType,
          deliveryAddress: {
            recipientName: customer.name,
            ...customer.address,
            phone: customer.phone
          },
          deliveryDate: orderTemplate.deliveryDate,
          paymentStatus: 'paid',
          paymentMethod: 'card',
          specialInstructions: orderTemplate.specialInstructions
        });

        await order.save();
        allOrders.push(order);
        console.log(`✅ ORDER: ${customer.name} - ${bouquet.name} - $${bouquet.basePrice}`);
      }
    }
    console.log(`📊 Created ${allOrders.length} orders\n`);

    // Generate Comprehensive Summary
    console.log('🎉 COMPLETE DATA SEEDING FINISHED!');
    console.log('==================================\n');
    
    console.log('📊 DATABASE SUMMARY:');
    console.log('-------------------');
    console.log(`👑 Admin Users: 1`);
    console.log(`👥 Customers: ${sampleUsers.length}`);
    console.log(`🏪 Vendors: ${allVendors.length}`);
    console.log(`💐 Products: ${allProducts.length}`);
    console.log(`💐 Bouquets: ${allBouquets.length}`);
    console.log(`📦 Orders: ${allOrders.length}\n`);

    console.log('🔐 LOGIN CREDENTIALS:');
    console.log('--------------------');
    console.log('👑 ADMIN:');
    console.log(`   📧 ${adminUser.email} / ${adminUser.password} - Full system access\n`);
    
    console.log('👥 CUSTOMERS:');
    sampleUsers.forEach(user => {
      console.log(`   📧 ${user.email} / ${user.password} - ${user.name}`);
    });
    
    console.log('\n🏪 VENDORS:');
    sampleVendors.forEach(vendor => {
      console.log(`   📧 ${vendor.email} / ${vendor.password} - ${vendor.businessName}`);
    });

    console.log('\n💐 PRODUCT CATEGORIES:');
    const categoryCount = sampleProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    console.log('\n🌐 ADMIN DASHBOARD FEATURES:');
    console.log('--------------------------');
    console.log('✅ User Management - View all users, vendors, and customers');
    console.log('✅ Product Management - Manage all products and inventory');
    console.log('✅ Order Management - View and manage all orders');
    console.log('✅ Vendor Management - Approve/disable vendor accounts');
    console.log('✅ Analytics - View sales reports and business metrics');

    console.log('\n💡 TESTING SCENARIOS:');
    console.log('-------------------');
    console.log('1. Login as admin@flowery.com to access admin dashboard');
    console.log('2. Login as customer to browse products and place orders');
    console.log('3. Login as vendor to manage business profile');
    console.log('4. Test admin features: user management, order tracking');
    console.log('5. Explore product filtering by category and type');

  } catch (error) {
    console.error('❌ SEEDING FAILED:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(field => {
        console.log(`   ${field}: ${error.errors[field].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the seeding
if (require.main === module) {
  seedCompleteDataWithAdmin().catch(console.error);
}

module.exports = { seedCompleteDataWithAdmin };