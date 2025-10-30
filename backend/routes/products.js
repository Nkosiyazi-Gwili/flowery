// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      type, 
      featured, 
      inStock,
      search,
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = { isActive: true };
    
    if (category && category !== 'all') query.category = category;
    if (type && type !== 'all') query.type = type;
    if (featured) query.isFeatured = featured === 'true';
    if (inStock) query.inStock = inStock === 'true';
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all products (including inactive - for admin)
// @route   GET /api/products/admin
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { 
      category, 
      type, 
      inStock,
      isActive,
      search,
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') query.category = category;
    if (type && type !== 'all') query.type = type;
    if (inStock) query.inStock = inStock === 'true';
    if (isActive) query.isActive = isActive === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get product categories
// @route   GET /api/products/categories/all
// @access  Public
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin routes for product management
router.use(protect);
router.use(authorize('admin'));

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      description,
      price,
      cost,
      images,
      stockQuantity,
      season,
      colors,
      fragrance,
      careInstructions,
      vaseLife,
      tags,
      isFeatured
    } = req.body;

    // Check if product already exists
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this name already exists' });
    }

    // Auto-set inStock based on stockQuantity
    const inStock = stockQuantity > 0;

    const product = await Product.create({
      name,
      type,
      category,
      description,
      price,
      cost,
      images: images || [],
      stockQuantity: stockQuantity || 0,
      inStock,
      season: season || [],
      colors: colors || [],
      fragrance: fragrance || 'none',
      careInstructions,
      vaseLife,
      tags: tags || [],
      isFeatured: isFeatured || false,
      isActive: true
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      description,
      price,
      cost,
      images,
      stockQuantity,
      season,
      colors,
      fragrance,
      careInstructions,
      vaseLife,
      tags,
      isFeatured,
      isActive
    } = req.body;

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if name is being changed and if it conflicts with another product
    if (name && name !== product.name) {
      const existingProduct = await Product.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this name already exists' });
      }
    }

    // Auto-update inStock based on stockQuantity
    let inStock = product.inStock;
    if (stockQuantity !== undefined) {
      inStock = stockQuantity > 0;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        category,
        description,
        price,
        cost,
        images,
        stockQuantity,
        inStock,
        season,
        colors,
        fragrance,
        careInstructions,
        vaseLife,
        tags,
        isFeatured,
        isActive
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
router.patch('/:id/stock', async (req, res) => {
  try {
    const { stockQuantity, operation } = req.body; // operation: 'set', 'increment', 'decrement'

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newStockQuantity = product.stockQuantity;

    switch (operation) {
      case 'set':
        newStockQuantity = stockQuantity;
        break;
      case 'increment':
        newStockQuantity += stockQuantity;
        break;
      case 'decrement':
        newStockQuantity = Math.max(0, newStockQuantity - stockQuantity);
        break;
      default:
        newStockQuantity = stockQuantity;
    }

    const inStock = newStockQuantity > 0;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stockQuantity: newStockQuantity,
        inStock
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Toggle product featured status
// @route   PATCH /api/products/:id/featured
// @access  Private/Admin
router.patch('/:id/featured', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isFeatured: !product.isFeatured },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Toggle product active status
// @route   PATCH /api/products/:id/active
// @access  Private/Admin
router.patch('/:id/active', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: !product.isActive },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Mark product as out of stock
// @route   PATCH /api/products/:id/out-of-stock
// @access  Private/Admin
router.patch('/:id/out-of-stock', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        inStock: false,
        stockQuantity: 0 
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Restock product
// @route   PATCH /api/products/:id/restock
// @access  Private/Admin
router.patch('/:id/restock', async (req, res) => {
  try {
    const { stockQuantity } = req.body;

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        inStock: true,
        stockQuantity: stockQuantity || 10 
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Instead of hard delete, we can soft delete by setting isActive to false
    // await Product.findByIdAndDelete(req.params.id);
    
    // Soft delete approach (recommended)
    await Product.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: false,
        inStock: false,
        stockQuantity: 0
      },
      { new: true }
    );

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Bulk update products
// @route   PATCH /api/products/bulk/update
// @access  Private/Admin
router.patch('/bulk/update', async (req, res) => {
  try {
    const { productIds, updateData } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }

    // Handle stock quantity updates for inStock auto-update
    if (updateData.stockQuantity !== undefined) {
      updateData.inStock = updateData.stockQuantity > 0;
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: updateData }
    );

    res.json({ 
      message: `${result.modifiedCount} products updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get product statistics
// @route   GET /api/products/stats/overview
// @access  Private/Admin
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false, isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true, isActive: true });
    
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const typeStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalProducts,
      activeProducts,
      outOfStockProducts,
      featuredProducts,
      categoryStats,
      typeStats
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;