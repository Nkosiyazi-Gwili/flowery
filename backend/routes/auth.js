// routes/auth.js
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const Vendor = require('../models/Vendor');
const User = require('../models/User');

const router = express.Router();

// @desc    Register user/vendor
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, businessName, businessType, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    const vendorExists = await Vendor.findOne({ email });
    
    if (userExists || vendorExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    let newUser;
    
    if (role === 'vendor') {
      // Create vendor
      newUser = await Vendor.create({
        name,
        email,
        password,
        businessName,
        businessType,
        phone,
        role: 'vendor'
      });
    } else {
      // Create regular user
      newUser = await User.create({
        name,
        email,
        password,
        role: role || 'customer'
      });
    }

    // Generate token (you'll need to implement this in your authController)
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        businessName: newUser.businessName,
        businessType: newUser.businessType
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Helper function to generate token (move this to a separate file if needed)
const generateToken = (id) => {
  // Implement your JWT token generation here
  return require('jsonwebtoken').sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;