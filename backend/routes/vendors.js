// routes/vendors.js
const express = require('express');
const Vendor = require('../models/Vendor');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: vendors.length,
      vendors
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .select('-password');
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vendor not found' 
      });
    }

    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Vendor not found' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private/Vendor
router.put('/profile', protect, authorize('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @desc    Get vendor statistics
// @route   GET /api/vendors/stats/dashboard
// @access  Private/Vendor
router.get('/stats/dashboard', protect, authorize('vendor'), async (req, res) => {
  try {
    // You can add vendor-specific statistics here
    const vendorStats = {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0
    };

    res.json({
      success: true,
      stats: vendorStats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;