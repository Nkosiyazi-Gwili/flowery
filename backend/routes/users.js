// routes/users.js
const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router(); // Use Express Router

router.use(protect); // Protect all routes

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', updateProfile);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Admin only routes
router.use(authorize('admin')); // All routes below require admin role

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', getUsers);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', getUser);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', updateUser);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', deleteUser);

module.exports = router;