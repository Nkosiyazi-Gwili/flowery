// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['flower', 'greenery', 'filler', 'accessory'],
    required: true
  },
  category: {
    type: String,
    enum: ['roses', 'lilies', 'tulips', 'sunflowers', 'orchids', 'mixed', 'seasonal'],
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  images: [String],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  season: [String],
  colors: [String],
  fragrance: {
    type: String,
    enum: ['none', 'light', 'medium', 'strong'],
    default: 'none'
  },
  careInstructions: String,
  vaseLife: Number, // in days
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (!this.cost) return 0;
  return ((this.price - this.cost) / this.price * 100).toFixed(2);
});

// Virtual for low stock alert
productSchema.virtual('isLowStock').get(function() {
  return this.stockQuantity > 0 && this.stockQuantity <= this.lowStockThreshold;
});

// Method to check availability
productSchema.methods.checkAvailability = function(quantity = 1) {
  return this.inStock && this.stockQuantity >= quantity;
};

// Update inStock based on stockQuantity before saving
productSchema.pre('save', function(next) {
  this.inStock = this.stockQuantity > 0;
  next();
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, type: 1, isActive: 1 });
productSchema.index({ vendor: 1 }); // Add index for vendor field

module.exports = mongoose.model('Product', productSchema);