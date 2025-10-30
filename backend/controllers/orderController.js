// controllers/orderController.js
const Order = require('../models/Order');
const Bouquet = require('../models/Bouquet');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      bouquet,
      flowers,
      deliveryType,
      deliveryAddress,
      deliveryDate,
      specialInstructions,
      paymentMethod
    } = req.body;

    // Get bouquet to calculate total amount
    const bouquetData = await Bouquet.findById(bouquet);
    if (!bouquetData) {
      return res.status(404).json({ message: 'Bouquet not found' });
    }

    const order = await Order.create({
      customer: req.user.id,
      bouquet,
      flowers,
      totalAmount: bouquetData.basePrice,
      deliveryType,
      deliveryAddress,
      deliveryDate,
      specialInstructions,
      paymentMethod
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('bouquet')
      .populate('flowers.flower');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('bouquet')
      .populate('flowers.flower')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin/Florist)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search in order ID or customer name
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'deliveryAddress.recipientName': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('bouquet')
      .populate('flowers.flower')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('bouquet')
      .populate('flowers.flower');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin/florist
    if (order.customer._id.toString() !== req.user.id && 
        !['admin', 'florist'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Florist
const updateOrderStatus = async (req, res) => {
  try {
    const { status, floristNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (floristNotes) {
      order.floristNotes = floristNotes;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
};