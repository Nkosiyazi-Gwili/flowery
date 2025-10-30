// routes/orders.js
const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);

// Admin and Florist routes
router.get('/', authorize('admin', 'florist'), getOrders);
router.put('/:id/status', authorize('admin', 'florist'), updateOrderStatus);
router.delete('/:id', authorize('admin'), deleteOrder);

module.exports = router;