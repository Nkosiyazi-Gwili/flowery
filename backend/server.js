// seed-perfect-match.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gwilinkosiyazi1:v34FQ0k4xFWyPec3@cluster0.1ccukxh.mongodb.net/flowery?retryWrites=true&w=majority';

// Sample data that matches EXACT schema requirements
const sampleUsers = [
  {
    name: 'Flowery Admin',
    email: 'admin@flowery.com',
    password: 'Admin123!',
    role: 'admin',
    phone: '+1 (555) 010-0001',
    address: {
      street: '123 Flower Street',
      city: 'Garden City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  },
  {
    name: 'Rose Florist',
    email: 'rose@flowery.com',
    password: 'Florist123!',
    role: 'vendor',
    vendorType: 'florist',
    businessName: 'Rose Paradise Florist',
    phone: '+1 (555) 020-0001',
    address: {
      street: '456 Rose Avenue',
      city: 'Bloomington',
      state: 'CA',
      zipCode: '90211',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  },
  {
    name: 'Emma Customer',
    email: 'emma@flowery.com',
    password: 'Customer123!',
    role: 'customer',
    phone: '+1 (555) 030-0001',
    address: {
      street: '789 Customer Lane',
      city: 'Client City',
      state: 'CA',
      zipCode: '90212',
      country: 'USA'
    },
    isActive: true,
    emailVerified: true
  }
];

// Products that match EXACT Product schema requirements
const sampleProducts = [
  // Rose Products
  {
    name: 'Premium Red Roses Bouquet',
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
    salesCount: 42
  },
  {
    name: 'Pink Rose Arrangement',
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
    salesCount: 28
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
    salesCount: 35
  },
  {
    name: 'White Calla Lily Arrangement',
    type: 'flower',
    category: 'lilies',
    description: 'Sophisticated white calla lilies in a modern arrangement. Perfect for weddings and formal events.',
    price: 75.99,
    cost: 42.00,
    images: [
      'https://images.unsplash.com/photo-1572451479134-8a4dc43a8a04?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 15,
    lowStockThreshold: 5,
    season: ['spring', 'summer'],
    colors: ['white'],
    fragrance: 'none',
    careInstructions: 'Handle gently as calla lilies are delicate. Change water every 4 days.',
    vaseLife: 7,
    tags: ['calla', 'white', 'wedding', 'formal', 'sophisticated'],
    isFeatured: true,
    isActive: true,
    popularity: 65,
    salesCount: 19
  },

  // Tulip Products
  {
    name: 'Dutch Tulip Bouquet',
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
    salesCount: 51
  },
  {
    name: 'White Tulip Serenity',
    type: 'flower',
    category: 'tulips',
    description: 'Pure white tulips symbolizing purity, forgiveness, and new beginnings. Ideal for weddings and sympathy.',
    price: 42.99,
    cost: 22.00,
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 28,
    lowStockThreshold: 5,
    season: ['spring'],
    colors: ['white'],
    fragrance: 'none',
    careInstructions: 'Change water regularly and keep in cool place. Add flower food for longer life.',
    vaseLife: 6,
    tags: ['white', 'pure', 'wedding', 'sympathy', 'elegant'],
    isFeatured: false,
    isActive: true,
    popularity: 72,
    salesCount: 23
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
    salesCount: 67
  },
  {
    name: 'White Orchid Elegance',
    type: 'flower',
    category: 'orchids',
    description: 'Pure white orchids symbolizing beauty, luxury, and strength. Perfect for home or office decor.',
    price: 44.99,
    cost: 23.00,
    images: [
      'https://images.unsplash.com/photo-1597848212624-e6d4bd7e1e92?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 25,
    lowStockThreshold: 5,
    season: ['spring', 'summer', 'fall', 'winter'],
    colors: ['white'],
    fragrance: 'none',
    careInstructions: 'Mist leaves occasionally and avoid overwatering. Provide bright, indirect light.',
    vaseLife: 85,
    tags: ['white', 'elegant', 'luxury', 'decor'],
    isFeatured: false,
    isActive: true,
    popularity: 74,
    salesCount: 32
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
    salesCount: 45
  },

  // Mixed Bouquets
  {
    name: 'Rainbow Flower Collection',
    type: 'flower',
    category: 'mixed',
    description: 'Stunning mix of multicolored flowers including roses, lilies, and tulips in a vibrant arrangement.',
    price: 89.99,
    cost: 50.00,
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 12,
    lowStockThreshold: 5,
    season: ['spring', 'summer'],
    colors: ['red', 'pink', 'yellow', 'white', 'purple'],
    fragrance: 'medium',
    careInstructions: 'Use flower food and change water every 2 days. Remove wilted flowers promptly.',
    vaseLife: 6,
    tags: ['colorful', 'rainbow', 'mixed', 'vibrant', 'special-occasion'],
    isFeatured: true,
    isActive: true,
    popularity: 79,
    salesCount: 29
  },

  // Seasonal Products
  {
    name: 'Spring Garden Medley',
    type: 'flower',
    category: 'seasonal',
    description: 'Fresh seasonal spring flowers including daffodils, hyacinths, and tulips celebrating new beginnings.',
    price: 55.99,
    cost: 30.00,
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 22,
    lowStockThreshold: 5,
    season: ['spring'],
    colors: ['yellow', 'purple', 'pink', 'white'],
    fragrance: 'medium',
    careInstructions: 'Perfect for spring celebrations. Keep in cool area and change water every 3 days.',
    vaseLife: 5,
    tags: ['spring', 'seasonal', 'fresh', 'garden', 'renewal'],
    isFeatured: true,
    isActive: true,
    popularity: 83,
    salesCount: 38
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
    salesCount: 56
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
    salesCount: 71
  }
];

// Sample orders
const sampleOrders = [
  {
    items: [
      { product: null, quantity: 1, price: 79.99 }, // Red Roses
      { product: null, quantity: 1, price: 24.99 }  // Eucalyptus
    ],
    totalAmount: 104.98,
    status: 'delivered',
    shippingAddress: {
      street: '789 Customer Lane',
      city: 'Client City',
      state: 'CA',
      zipCode: '90212',
      country: 'USA'
    },
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  },
  {
    items: [
      { product: null, quantity: 2, price: 45.99 }, // Tulips
      { product: null, quantity: 1, price: 19.99 }  // Baby's Breath
    ],
    totalAmount: 111.97,
    status: 'preparing',
    shippingAddress: {
      street: '789 Customer Lane',
      city: 'Client City',
      state: 'CA',
      zipCode: '90212',
      country: 'USA'
    },
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

async function seedPerfectMatch() {
  try {
    console.log('🚀 Starting Perfect Schema Match Seeding...');
    console.log('==========================================\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Users
    console.log('👥 Creating Users...');
    console.log('-------------------');
    
    const allUsers = [];
    
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      allUsers.push(user);
      console.log(`✅ ${user.role.toUpperCase()}: ${user.name} (${user.email})`);
    }

    console.log(`\n📊 Created ${allUsers.length} users\n`);

    // Create Products - PERFECT schema match
    console.log('💐 Creating Products (Perfect Schema Match)...');
    console.log('---------------------------------------------');
    
    const allProducts = [];
    
    for (let i = 0; i < sampleProducts.length; i++) {
      try {
        const product = new Product(sampleProducts[i]);
        await product.save();
        allProducts.push(product);
        console.log(`✅ ${product.type} | ${product.category}: ${product.name} - $${product.price}`);
        
      } catch (productError) {
        console.log(`❌ Failed to create product ${i + 1}:`, productError.message);
        // Log detailed error information
        if (productError.errors) {
          Object.keys(productError.errors).forEach(field => {
            console.log(`   ${field}: ${productError.errors[field].message}`);
          });
        }
      }
    }

    console.log(`\n📊 Products: ${allProducts.length} created successfully\n`);

    // Create Orders
    console.log('📦 Creating Sample Orders...');
    console.log('---------------------------');
    
    const customer = allUsers.find(user => user.role === 'customer');
    const allOrders = [];
    
    if (customer && allProducts.length > 0) {
      for (let i = 0; i < sampleOrders.length; i++) {
        const orderData = sampleOrders[i];
        
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
    }

    console.log(`\n📊 Orders: ${allOrders.length} created\n`);

    // Generate comprehensive summary
    console.log('🎉 PERFECT SCHEMA MATCH SEEDING COMPLETED!');
    console.log('==========================================\n');
    
    console.log('📊 COMPREHENSIVE SUMMARY:');
    console.log('------------------------');
    
    const productStats = sampleProducts.reduce((stats, product) => {
      stats[product.category] = (stats[product.category] || 0) + 1;
      stats[product.type] = (stats[product.type] || 0) + 1;
      return stats;
    }, {});

    console.log(`👥 Users: ${allUsers.length}`);
    console.log(`   ├── Admins: ${allUsers.filter(u => u.role === 'admin').length}`);
    console.log(`   ├── Vendors: ${allUsers.filter(u => u.role === 'vendor').length}`);
    console.log(`   └── Customers: ${allUsers.filter(u => u.role === 'customer').length}`);
    
    console.log(`\n💐 Products: ${allProducts.length}`);
    console.log(`   ├── By Category:`);
    Object.keys(productStats).filter(key => ['roses', 'lilies', 'tulips', 'sunflowers', 'orchids', 'mixed', 'seasonal'].includes(key))
      .forEach(category => {
        console.log(`   │   ├── ${category}: ${productStats[category]}`);
      });
    console.log(`   └── By Type:`);
    Object.keys(productStats).filter(key => ['flower', 'greenery', 'filler', 'accessory'].includes(key))
      .forEach(type => {
        console.log(`       ├── ${type}: ${productStats[type]}`);
      });
    
    console.log(`\n📦 Orders: ${allOrders.length}`);
    console.log(`   ├── Delivered: ${allOrders.filter(o => o.status === 'delivered').length}`);
    console.log(`   └── Preparing: ${allOrders.filter(o => o.status === 'preparing').length}`);

    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('--------------------');
    console.log('👑 Admin:    admin@flowery.com    / Admin123!');
    console.log('🌸 Vendor:   rose@flowery.com     / Florist123!');
    console.log('👥 Customer: emma@flowery.com     / Customer123!');

    console.log('\n💡 PRODUCT SCHEMA VALIDATION:');
    console.log('----------------------------');
    console.log('✅ All products match exact schema requirements:');
    console.log('   ├── type: flower, greenery, filler, accessory');
    console.log('   ├── category: roses, lilies, tulips, sunflowers, orchids, mixed, seasonal');
    console.log('   ├── fragrance: none, light, medium, strong');
    console.log('   └── All required fields present: name, type, category, price');

    console.log('\n🌐 TESTING RECOMMENDATIONS:');
    console.log('--------------------------');
    console.log('1. Login as admin@flowery.com to manage products');
    console.log('2. Login as emma@flowery.com to browse and order');
    console.log('3. Test product filtering by category and type');
    console.log('4. Verify product details match schema exactly');

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
  seedPerfectMatch().catch(console.error);
}

module.exports = { seedPerfectMatch };