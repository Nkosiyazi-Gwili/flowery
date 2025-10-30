// controllers/adminController.js
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const revenue = await Order.aggregate([
      { $match: { status: 'delivered', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const popularProducts = await Product.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(5);

    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: revenue[0]?.total || 0
      },
      recentOrders,
      popularProducts,
      userStats
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};